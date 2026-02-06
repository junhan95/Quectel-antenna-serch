"""
Automated Image Mapping Script
Analyzes PDF text to automatically match extracted images with product IDs
"""

import fitz  # PyMuPDF
import json
import re
import os

def extract_text_from_pdf(pdf_path):
    """Extract text from each page of the PDF"""
    pdf_document = fitz.open(pdf_path)
    pages_text = {}
    
    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        text = page.get_text()
        pages_text[page_num + 1] = text
    
    pdf_document.close()
    return pages_text

def find_product_ids_on_page(page_text, all_product_ids):
    """Find all product IDs mentioned on a page"""
    found_products = []
    
    # Look for product ID patterns (Y followed by letters/numbers)
    # Match the actual product IDs from our database
    for product_id in all_product_ids:
        # Check if product ID appears in the text
        # Use word boundaries to avoid partial matches
        pattern = r'\b' + re.escape(product_id) + r'\b'
        if re.search(pattern, page_text, re.IGNORECASE):
            found_products.append(product_id)
    
    return found_products

def load_product_ids(json_path):
    """Load all product IDs from antennas.json"""
    with open(json_path, 'r', encoding='utf-8') as f:
        antennas = json.load(f)
    
    # Get all product IDs (including EVB variants)
    product_ids = [a['id'] for a in antennas]
    return product_ids

def auto_map_images(pdf_path, json_path, extracted_dir, output_file):
    """
    Automatically map extracted images to product IDs
    """
    print("Starting automated image mapping...")
    print("="*60)
    
    # Load product IDs
    print("\n1. Loading product IDs from antennas.json...")
    product_ids = load_product_ids(json_path)
    print(f"   Found {len(product_ids)} product IDs")
    
    # Extract text from PDF
    print("\n2. Extracting text from PDF...")
    pages_text = extract_text_from_pdf(pdf_path)
    print(f"   Processed {len(pages_text)} pages")
    
    # Get list of extracted images
    print("\n3. Analyzing extracted images...")
    images = sorted([f for f in os.listdir(extracted_dir) 
                    if f.endswith(('.png', '.jpg', '.jpeg'))])
    print(f"   Found {len(images)} images")
    
    # Create mapping
    print("\n4. Creating automatic mapping...")
    mapping = {}
    stats = {
        'mapped': 0,
        'unmapped': 0,
        'multiple_matches': 0
    }
    
    for image_file in images:
        # Extract page number from filename (e.g., page_003_img_01.png)
        match = re.match(r'page_(\d+)_img_(\d+)', image_file)
        if not match:
            continue
        
        page_num = int(match.group(1))
        img_num = int(match.group(2))
        
        # Get text from this page
        page_text = pages_text.get(page_num, "")
        
        # Find product IDs on this page
        products_on_page = find_product_ids_on_page(page_text, product_ids)
        
        if len(products_on_page) == 0:
            # No products found on this page
            mapping[image_file] = f"UNKNOWN_PAGE_{page_num:03d}"
            stats['unmapped'] += 1
            
        elif len(products_on_page) == 1:
            # Exactly one product - perfect match
            mapping[image_file] = products_on_page[0]
            stats['mapped'] += 1
            print(f"   ✓ {image_file} -> {products_on_page[0]}")
            
        else:
            # Multiple products on same page
            # Try to match by image number
            if img_num <= len(products_on_page):
                # Assign based on order (first image -> first product, etc.)
                mapping[image_file] = products_on_page[img_num - 1]
                stats['mapped'] += 1
                print(f"   ✓ {image_file} -> {products_on_page[img_num - 1]} (multi-match)")
            else:
                # More images than products, use placeholder
                mapping[image_file] = f"MULTI_{page_num:03d}_{products_on_page[0]}"
                stats['multiple_matches'] += 1
    
    # Save mapping
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print("\n" + "="*60)
    print("Automated mapping complete!")
    print("="*60)
    print(f"Successfully mapped:     {stats['mapped']}")
    print(f"Multiple matches:        {stats['multiple_matches']}")
    print(f"Unmapped (no products):  {stats['unmapped']}")
    print(f"Total images:            {len(images)}")
    print("="*60)
    print(f"\nMapping saved to: {output_file}")
    print("\nNext steps:")
    print("1. Review the mapping file and correct any errors")
    print("2. Run: python match_images.py apply")
    
    return mapping

if __name__ == "__main__":
    # Configuration
    pdf_path = "Quectel antenna brochure_V2.7[28].pdf"
    json_path = "./src/data/antennas.json"
    extracted_dir = "./public/images/extracted"
    output_file = "image_mapping.json"
    
    # Check if files exist
    if not os.path.exists(pdf_path):
        print(f"Error: PDF file not found: {pdf_path}")
        exit(1)
    
    if not os.path.exists(json_path):
        print(f"Error: JSON file not found: {json_path}")
        exit(1)
    
    if not os.path.exists(extracted_dir):
        print(f"Error: Extracted images directory not found: {extracted_dir}")
        exit(1)
    
    # Run automated mapping
    auto_map_images(pdf_path, json_path, extracted_dir, output_file)
