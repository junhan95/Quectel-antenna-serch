"""
PDF Image Extraction Script for Quectel Antenna Brochure
Extracts all images from the PDF and saves them with page/image numbers
"""

import fitz  # PyMuPDF
import os
from PIL import Image
import io

def extract_images_from_pdf(pdf_path, output_dir):
    """
    Extract all images from PDF and save them
    
    Args:
        pdf_path: Path to the PDF file
        output_dir: Directory to save extracted images
    
    Returns:
        Number of images extracted
    """
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Opening PDF: {pdf_path}")
    
    try:
        # Open PDF
        pdf_document = fitz.open(pdf_path)
        print(f"PDF loaded successfully. Total pages: {len(pdf_document)}")
        
        image_count = 0
        image_info = []
        
        # Iterate through pages
        for page_num in range(len(pdf_document)):
            page = pdf_document[page_num]
            
            # Get images on this page
            image_list = page.get_images(full=True)
            
            if len(image_list) > 0:
                print(f"\nPage {page_num + 1}: Found {len(image_list)} images")
            
            for img_index, img in enumerate(image_list):
                try:
                    xref = img[0]
                    
                    # Extract image
                    base_image = pdf_document.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    # Get image dimensions
                    width = base_image.get("width", 0)
                    height = base_image.get("height", 0)
                    
                    # Skip very small images (likely logos or decorative elements)
                    if width < 50 or height < 50:
                        print(f"  Skipping small image: {width}x{height}px")
                        continue
                    
                    # Create filename
                    image_filename = f"page_{page_num + 1:03d}_img_{img_index + 1:02d}.{image_ext}"
                    image_path = os.path.join(output_dir, image_filename)
                    
                    # Save image
                    with open(image_path, "wb") as img_file:
                        img_file.write(image_bytes)
                    
                    # Store info
                    image_info.append({
                        'filename': image_filename,
                        'page': page_num + 1,
                        'index': img_index + 1,
                        'width': width,
                        'height': height,
                        'format': image_ext
                    })
                    
                    print(f"  ✓ Saved: {image_filename} ({width}x{height}px)")
                    image_count += 1
                    
                except Exception as e:
                    print(f"  ✗ Error extracting image {img_index + 1}: {e}")
        
        pdf_document.close()
        
        # Save image catalog
        catalog_path = os.path.join(output_dir, "image_catalog.txt")
        with open(catalog_path, "w", encoding="utf-8") as f:
            f.write("Image Extraction Catalog\n")
            f.write("=" * 50 + "\n\n")
            for info in image_info:
                f.write(f"File: {info['filename']}\n")
                f.write(f"  Page: {info['page']}\n")
                f.write(f"  Size: {info['width']}x{info['height']}px\n")
                f.write(f"  Format: {info['format']}\n")
                f.write("\n")
        
        print(f"\n{'='*50}")
        print(f"Extraction complete!")
        print(f"Total images extracted: {image_count}")
        print(f"Catalog saved to: {catalog_path}")
        print(f"{'='*50}")
        
        return image_count
        
    except Exception as e:
        print(f"Error: {e}")
        return 0

if __name__ == "__main__":
    # Configuration
    pdf_path = "Quectel antenna brochure_V2.7[28].pdf"
    output_dir = "./public/images/extracted"
    
    # Check if PDF exists
    if not os.path.exists(pdf_path):
        print(f"Error: PDF file not found: {pdf_path}")
        print("Please make sure the PDF is in the current directory.")
        exit(1)
    
    # Run extraction
    extract_images_from_pdf(pdf_path, output_dir)
    
    print("\nNext steps:")
    print("1. Review the extracted images in ./public/images/extracted/")
    print("2. Use the image_catalog.txt to identify which images belong to which products")
    print("3. Run the matching script to rename images by product ID")
