-- Supabase Database Schema for Quectel Antenna Search
-- Run this in Supabase SQL Editor

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  subcategory TEXT,
  specs JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  image_type TEXT,
  has_real_image BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- Create index for faster product lookups
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
CREATE INDEX IF NOT EXISTS idx_inquiries_timestamp ON inquiries(timestamp DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Products are viewable by everyone" 
  ON products FOR SELECT 
  USING (true);

CREATE POLICY "Inquiries are insertable by everyone" 
  ON inquiries FOR INSERT 
  WITH CHECK (true);

-- Create policies for authenticated admin access
-- Note: For now using anon key, all operations are allowed
CREATE POLICY "Products are manageable by authenticated users" 
  ON products FOR ALL 
  USING (true);

CREATE POLICY "Inquiries are manageable by authenticated users" 
  ON inquiries FOR ALL 
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for products updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
