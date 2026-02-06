"""
Image Matching Script
Helps match extracted PDF images to product IDs
"""

import os
import shutil
import json

def load_product_ids(json_path):
    """Load product IDs from antennas.json"""
    with open(json_path, 'r', encoding='utf-8') as f:
        antennas = json.load(f)
    
    # Extract unique product IDs (excluding EVB variants for now)
    product_ids = [a['id'] for a in antennas if not a['id'].endswith('EVB')]
    
    print(f"Loaded {len(product_ids)} product IDs")
    return product_ids

def create_mapping_template(extracted_dir, output_file):
    """Create a template mapping file for manual editing"""
    
    # Get list of extracted images
    images = sorted([f for f in os.listdir(extracted_dir) 
                    if f.endswith(('.png', '.jpg', '.jpeg'))])
    
    print(f"Found {len(images)} extracted images")
    
    # Create mapping template
    mapping = {}
    for img in images:
        # Extract page number from filename
        if img.startswith('page_'):
            parts = img.split('_')
            page_num = parts[1]
            mapping[img] = f"PRODUCT_ID_PAGE_{page_num}"  # Placeholder
    
    # Save template
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, indent=2, ensure_ascii=False)
    
    print(f"Mapping template saved to: {output_file}")
    print("\nPlease edit this file to map images to product IDs:")
    print(f"  {output_file}")
    print("\nExample:")
    print('  "page_003_img_01.png": "YC0018CA",')
    print('  "page_003_img_02.png": "YC0018CAEVB",')

def apply_mapping(mapping_file, extracted_dir, products_dir):
    """Apply the mapping to rename images"""
    
    # Load mapping
    with open(mapping_file, 'r', encoding='utf-8') as f:
        mapping = json.load(f)
    
    # Create products directory
    os.makedirs(products_dir, exist_ok=True)
    
    renamed_count = 0
    
    for old_name, product_id in mapping.items():
        # Skip placeholder entries
        if product_id.startswith('PRODUCT_ID_'):
            continue
        
        old_path = os.path.join(extracted_dir, old_name)
        
        if not os.path.exists(old_path):
            print(f"Warning: {old_name} not found")
            continue
        
        # Get file extension
        ext = os.path.splitext(old_name)[1]
        new_name = f"{product_id}{ext}"
        new_path = os.path.join(products_dir, new_name)
        
        # Copy file
        shutil.copy2(old_path, new_path)
        print(f"✓ {old_name} -> {new_name}")
        renamed_count += 1
    
    print(f"\nRenamed {renamed_count} images")
    print(f"Images saved to: {products_dir}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Step 1: Create mapping template")
        print("    python match_images.py create")
        print()
        print("  Step 2: Apply mapping (after editing image_mapping.json)")
        print("    python match_images.py apply")
        sys.exit(1)
    
    command = sys.argv[1]
    
    extracted_dir = "./public/images/extracted"
    products_dir = "./public/images/products"
    mapping_file = "image_mapping.json"
    json_path = "./src/data/antennas.json"
    
    if command == "create":
        print("Creating mapping template...")
        create_mapping_template(extracted_dir, mapping_file)
        
        # Also load and display product IDs for reference
        print("\n" + "="*50)
        print("Available Product IDs (first 20):")
        print("="*50)
        product_ids = load_product_ids(json_path)
        for i, pid in enumerate(product_ids[:20]):
            print(f"  {pid}")
        if len(product_ids) > 20:
            print(f"  ... and {len(product_ids) - 20} more")
        
    elif command == "apply":
        if not os.path.exists(mapping_file):
            print(f"Error: {mapping_file} not found")
            print("Run 'python match_images.py create' first")
            sys.exit(1)
        
        print("Applying mapping...")
        apply_mapping(mapping_file, extracted_dir, products_dir)
        
    else:
        print(f"Unknown command: {command}")
        print("Use 'create' or 'apply'")
