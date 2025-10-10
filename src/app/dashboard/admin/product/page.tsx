/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Alert,
  useTheme,
  Tooltip,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Refresh,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import Cookies from 'js-cookie';

type Product = {
  _id: string;
  name: string;
  slug?: string;
  brand?: string;
  price: number;
  stock?: number;
  isPublished?: boolean;
  updatedAt?: string;
};

const formatCurrency = (n?: number) =>
  typeof n === 'number' ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n) : '-';

export default function ProductPage() {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [drafts, setDrafts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [form, setForm] = React.useState<{
    name: string;
    slug: string;
    brand: string;
    price: string;
    description: string;
    compareAtPrice: string;
    currency: string;
    categories: string;
    tags: string;
    isPublished: boolean;
    isActive: boolean;
    // removed quick-add single image fields; use imagesList
    imagesList: Array<{ url: string; alt: string; publicId: string; isPrimary: boolean; file?: File | null }>;
    variants: Array<{
      name: string;
      sku: string;
      price: string;
      compareAtPrice: string;
      stock: string;
      isActive: boolean;
      images: Array<{ url: string; alt: string }>;
      attributes: Array<{ key: string; value: string }>;
    }>;
    sku: string;
    barcode: string;
    taxClass: string;
    stock: string;
    trackInventory: boolean;
    weight: string;
    dimensionLength: string;
    dimensionWidth: string;
    dimensionHeight: string;
    dimensionUnit: string;
    shippingRequired: boolean;
    visibility: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    vendor: string;
    countryOfOrigin: string;
  }>(
    {
      name: '',
      slug: '',
      brand: '',
      price: '',
      description: '',
      compareAtPrice: '',
      currency: 'USD',
      categories: '',
      tags: '',
      isPublished: false,
      isActive: true,
      
      imagesList: [],
      variants: [],
      sku: '',
      barcode: '',
      taxClass: '',
      stock: '',
      trackInventory: true,
      weight: '',
      dimensionLength: '',
      dimensionWidth: '',
      dimensionHeight: '',
      dimensionUnit: 'cm',
      shippingRequired: true,
      visibility: 'public',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      vendor: '',
      countryOfOrigin: ''
    }
  );

  const apiBase = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`;

  const authHeaders = React.useCallback((contentType?: string): HeadersInit => {
    const token = Cookies.get('authToken');
    const headers: Record<string, string> = {};
    if (contentType) headers['Content-Type'] = contentType;
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, []);

  const fetchLists = React.useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const [pubRes] = await Promise.all([
        fetch(`${apiBase}?page=1&limit=50`, { cache: 'no-store' }),
      ]);
      if (!pubRes.ok) throw new Error('Failed to load products');
      const pubData: { items?: Product[] } = await pubRes.json();
      setProducts(pubData.items ?? []);
      // Drafts are not exposed by the public GET API; keep empty unless created locally
      setDrafts([]);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const normalizeCsvInput = (raw: string): string => {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map((s: unknown) => String(s)).join(', ');
    } catch {
      // not JSON; fall through
    }
    return raw;
  };

  const displayCsv = (val: unknown): string => {
    if (Array.isArray(val)) return (val as unknown[]).map((s) => String(s)).join(', ');
    if (val == null) return '';
    const s = String(val);
    return normalizeCsvInput(s);
  };

  const parseMaybeStringArray = (val: unknown): string[] | undefined => {
    if (!val) return undefined;
    if (Array.isArray(val)) return val as string[];
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : undefined;
      } catch {
        return val.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return undefined;
  };

  type AnyRecord = Record<string, unknown>;
  const mapProductToForm = (p: Product & AnyRecord) => {
    const imagesList = Array.isArray(p.images)
      ? (p.images as AnyRecord[]).map((img: AnyRecord, idx: number) => ({
          url: String(img?.url || ''),
          alt: String(img?.alt || ''),
          publicId: typeof img?.publicId === 'string' ? img.publicId : '',
          isPrimary: Boolean(img?.isPrimary ?? idx === 0),
          file: null,
        }))
      : [];

    const variants = Array.isArray(p.variants)
      ? (p.variants as AnyRecord[]).map((v: AnyRecord) => ({
          name: String(v?.name || ''),
          sku: String(v?.sku || ''),
          price: v?.price != null ? String(v.price) : '',
          compareAtPrice: v?.compareAtPrice != null ? String(v.compareAtPrice) : '',
          stock: v?.stock != null ? String(v.stock) : '',
          isActive: Boolean(v?.isActive ?? true),
          images: Array.isArray(v?.images)
            ? (v.images as AnyRecord[]).map((vi: AnyRecord) => ({ url: String(vi?.url || ''), alt: String(vi?.alt || '') }))
            : [],
          attributes: v?.attributes
            ? Object.entries(v.attributes).map(([key, value]) => ({ key, value: String(value) }))
            : [],
        }))
      : [];

    const dims = (p as any)?.dimensions || {};
    const seo = (p as any)?.seo || {};
    setForm({
      name: String(p.name || ''),
      slug: String(p.slug || ''),
      brand: String(p.brand || ''),
      price: (p as any)?.price != null ? String((p as any).price) : '',
      description: String(p?.description || ''),
      compareAtPrice: (p as any)?.compareAtPrice != null ? String((p as any).compareAtPrice) : '',
      currency: String((p as any)?.currency || 'USD'),
      categories: (parseMaybeStringArray((p as any)?.categories) || []).join(', '),
      tags: (parseMaybeStringArray((p as any)?.tags) || []).join(', '),
      isPublished: !!(p as any)?.isPublished,
      isActive: !!(p as any)?.isActive,
      imagesList,
      variants,
      sku: String((p as any)?.sku || ''),
      barcode: String((p as any)?.barcode || ''),
      taxClass: String((p as any)?.taxClass || ''),
      stock: (p as any)?.stock != null ? String((p as any).stock) : '',
      trackInventory: !!(p as any)?.trackInventory,
      weight: (p as any)?.weight != null ? String((p as any).weight) : '',
      dimensionLength: dims?.length != null ? String(dims.length) : '',
      dimensionWidth: dims?.width != null ? String(dims.width) : '',
      dimensionHeight: dims?.height != null ? String(dims.height) : '',
      dimensionUnit: String(dims?.unit || 'cm'),
      shippingRequired: !!(p as any)?.shippingRequired,
      visibility: String((p as any)?.visibility || 'public'),
      seoTitle: String(seo?.title || ''),
      seoDescription: String(seo?.description || ''),
      seoKeywords: Array.isArray(seo?.keywords) ? (seo.keywords as string[]).join(', ') : '',
      vendor: String((p as any)?.vendor || ''),
      countryOfOrigin: String((p as any)?.countryOfOrigin || ''),
    });
  };

  const handleOpenCreate = () => {
    setForm({
      name: '', slug: '', brand: '', price: '', description: '', compareAtPrice: '', currency: 'USD',
      categories: '', tags: '', isPublished: false, isActive: true, imagesList: [], variants: [],
      sku: '', barcode: '', taxClass: '', stock: '', trackInventory: true, weight: '',
      dimensionLength: '', dimensionWidth: '', dimensionHeight: '', dimensionUnit: 'cm',
      shippingRequired: true, visibility: 'public', seoTitle: '', seoDescription: '', seoKeywords: '',
      vendor: '', countryOfOrigin: ''
    });
    setCreateOpen(true);
  };

  const handleCreate = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const variants = (form.variants || []).map((v: { name: string; sku: string; price: string; compareAtPrice: string; stock: string; isActive: boolean; images: Array<{ url: string; alt: string }>; attributes: Array<{ key: string; value: string }>; }) => ({
        name: v.name.trim() || undefined,
        sku: v.sku.trim() || undefined,
        price: v.price ? Number(v.price) : undefined,
        compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
        stock: v.stock ? Number(v.stock) : undefined,
        isActive: v.isActive,
        images: (v.images || []).filter(i => i.url.trim()).map(i => ({ url: i.url.trim(), alt: i.alt.trim() })),
        attributes: v.attributes && v.attributes.length
          ? Object.fromEntries(v.attributes.filter(a => a.key.trim()).map(a => [a.key.trim(), a.value]))
          : undefined,
      }));
      const body: Record<string, unknown> = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        brand: form.brand.trim() || undefined,
        description: form.description.trim() || undefined,
        price: Number(form.price) || 0,
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        currency: form.currency || 'USD',
        categories: form.categories ? form.categories.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        isPublished: form.isPublished,
        isActive: form.isActive,
        images: (form.imagesList.length ? form.imagesList : [])
          .filter(i => !i.file && i.url.trim())
          .map((i, idx) => ({ url: i.url.trim(), alt: i.alt.trim(), publicId: i.publicId?.trim() || undefined, isPrimary: i.isPrimary ?? idx === 0 })),
        variants: variants.length ? variants : undefined,
        sku: form.sku.trim() || undefined,
        barcode: form.barcode.trim() || undefined,
        taxClass: form.taxClass.trim() || undefined,
        stock: form.stock ? Number(form.stock) : undefined,
        trackInventory: form.trackInventory,
        weight: form.weight ? Number(form.weight) : undefined,
        dimensions: (form.dimensionLength || form.dimensionWidth || form.dimensionHeight) ? {
          length: form.dimensionLength ? Number(form.dimensionLength) : undefined,
          width: form.dimensionWidth ? Number(form.dimensionWidth) : undefined,
          height: form.dimensionHeight ? Number(form.dimensionHeight) : undefined,
          unit: form.dimensionUnit || 'cm'
        } : undefined,
        shippingRequired: form.shippingRequired,
        visibility: form.visibility || 'public',
        seo: (form.seoTitle || form.seoDescription || form.seoKeywords) ? {
          title: form.seoTitle.trim() || undefined,
          description: form.seoDescription.trim() || undefined,
          keywords: form.seoKeywords ? form.seoKeywords.split(',').map(s => s.trim()).filter(Boolean) : undefined
        } : undefined,
        vendor: form.vendor.trim() || undefined,
        countryOfOrigin: form.countryOfOrigin.trim() || undefined,
      };
      // If any files selected (global or per image), send multipart/form-data so backend can upload and set publicId
      const perRowFiles = form.imagesList.map(i => i.file).filter(Boolean) as File[];
      if (perRowFiles.length > 0) {
        const fd = new FormData();
        Object.entries(body).forEach(([k, v]) => {
          if (v === undefined) return;
          if (k === 'images' || k === 'variants' || k === 'categories' || k === 'tags' || k === 'seo') {
            fd.append(k, JSON.stringify(v));
          } else {
            fd.append(k, String(v));
          }
        });
        perRowFiles.forEach((file) => fd.append('images', file));
        const res = await fetch(apiBase, { method: 'POST', headers: authHeaders(/* no explicit content-type */), body: fd });
        if (!res.ok) {
          const j: { message?: string } | undefined = await res.json().catch(() => undefined);
          throw new Error(j?.message || 'Failed to create product');
        }
      } else {
        const res = await fetch(apiBase, {
          method: 'POST',
          headers: authHeaders('application/json'),
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const j: { message?: string } | undefined = await res.json().catch(() => undefined);
          throw new Error(j?.message || 'Failed to create product');
        }
      }
      setCreateOpen(false);
      setSuccess('Product created');
      await fetchLists();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Create failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = async (p: Product & Record<string, unknown>) => {
    try {
      setLoading(true);
      setError(null);
      // Try to fetch full product details to ensure images/seo/dimensions are present
      const res = await fetch(`${apiBase}/${p._id}`, { cache: 'no-store' });
      const full: (Product & Record<string, unknown>) | null = res.ok ? await res.json().catch(() => null) : null;
      const product = (full && (full as any)._id) ? full : p;

      setForm({
        name: product.name as string,
        slug: product.slug as string,
        brand: product.brand as string,
        price: product.price as unknown as string,
        description: product.description as string,
        compareAtPrice: product.compareAtPrice as string,
        currency: product.currency as string,
        categories: product.categories as string || '',
        tags: product.tags as string || '',
        isPublished: product.isPublished as boolean,
        isActive: product.isActive as boolean,
        imagesList: product.imagesList as { url: string; alt: string; publicId: string; isPrimary: boolean; file?: File | null; }[],
        variants: product.variants as { name: string; sku: string; price: string; compareAtPrice: string; stock: string; isActive: boolean; images: { url: string; alt: string }[]; attributes: { key: string; value: string }[]; }[],
        sku: product.sku as string,
        barcode: product.barcode as string,
        taxClass: product.taxClass as string,
        stock: product.stock as unknown as string ,
        trackInventory: product.trackInventory as boolean,
        weight: product.weight as string,
        dimensionLength: product.dimensionLength as string,
        dimensionWidth: product.dimensionWidth as string,
        dimensionHeight: product.dimensionHeight as string,
        dimensionUnit: product.dimensionUnit as string,
        shippingRequired: product.shippingRequired as boolean,
        visibility: product.visibility as string,
        seoTitle: product.seoTitle as string,
        seoDescription: product.seoDescription as string,
        seoKeywords: product.seoKeywords as string,
        vendor: product.vendor as string  ,
        countryOfOrigin: product.countryOfOrigin as string,
      });

      console.log('product', product);
      setEditing(product);
      mapProductToForm(product);
      setEditOpen(true);
    } catch {
      // Fallback to the row data if detail fetch fails
      console.log('p', p);
      setEditing(p);
      mapProductToForm(p);
      setEditOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (): Promise<void> => {
    if (!editing) return;
    try {
      setLoading(true);
      setError(null);
      const variants = (form.variants || []).map((v: { name: string; sku: string; price: string; compareAtPrice: string; stock: string; isActive: boolean; images: Array<{ url: string; alt: string }>; attributes: Array<{ key: string; value: string }>; }) => ({
        name: v.name.trim() || undefined,
        sku: v.sku.trim() || undefined,
        price: v.price ? Number(v.price) : undefined,
        compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
        stock: v.stock ? Number(v.stock) : undefined,
        isActive: v.isActive,
        images: (v.images || []).filter(i => i.url.trim()).map(i => ({ url: i.url.trim(), alt: i.alt.trim() })),
        attributes: v.attributes && v.attributes.length
          ? Object.fromEntries(v.attributes.filter(a => a.key.trim()).map(a => [a.key.trim(), a.value]))
          : undefined,
      }));

      const body: Record<string, unknown> = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        brand: form.brand.trim() || undefined,
        description: form.description.trim() || undefined,
        price: Number(form.price) || 0,
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        currency: form.currency || 'USD',
        categories: form.categories ? form.categories.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        isPublished: form.isPublished,
        isActive: form.isActive,
        images: (form.imagesList.length ? form.imagesList : [])
          .filter(i => !i.file && i.url.trim())
          .map((i, idx) => ({ url: i.url.trim(), alt: i.alt.trim(), publicId: i.publicId?.trim() || undefined, isPrimary: i.isPrimary ?? idx === 0 })),
        variants: variants.length ? variants : undefined,
        sku: form.sku.trim() || undefined,
        barcode: form.barcode.trim() || undefined,
        taxClass: form.taxClass.trim() || undefined,
        stock: form.stock ? Number(form.stock) : undefined,
        trackInventory: form.trackInventory,
        weight: form.weight ? Number(form.weight) : undefined,
        dimensions: (form.dimensionLength || form.dimensionWidth || form.dimensionHeight) ? {
          length: form.dimensionLength ? Number(form.dimensionLength) : undefined,
          width: form.dimensionWidth ? Number(form.dimensionWidth) : undefined,
          height: form.dimensionHeight ? Number(form.dimensionHeight) : undefined,
          unit: form.dimensionUnit || 'cm'
        } : undefined,
        shippingRequired: form.shippingRequired,
        visibility: form.visibility || 'public',
        seo: (form.seoTitle || form.seoDescription || form.seoKeywords) ? {
          title: form.seoTitle.trim() || undefined,
          description: form.seoDescription.trim() || undefined,
          keywords: form.seoKeywords ? form.seoKeywords.split(',').map(s => s.trim()).filter(Boolean) : undefined
        } : undefined,
        vendor: form.vendor.trim() || undefined,
        countryOfOrigin: form.countryOfOrigin.trim() || undefined,
      };

      const perRowFiles = form.imagesList.map(i => i.file).filter(Boolean) as File[];
      if (perRowFiles.length > 0) {
        const fd = new FormData();
        Object.entries(body).forEach(([k, v]) => {
          if (v === undefined) return;
          if (k === 'images' || k === 'variants' || k === 'categories' || k === 'tags' || k === 'seo') {
            fd.append(k, JSON.stringify(v));
          } else {
            fd.append(k, String(v));
          }
        });
        perRowFiles.forEach((file) => fd.append('images', file));
        const res = await fetch(`${apiBase}/${editing._id}`, { method: 'PUT', headers: authHeaders(/* multipart */), body: fd });
        if (!res.ok) {
          const j: { message?: string } | undefined = await res.json().catch(() => undefined);
          throw new Error(j?.message || 'Failed to update');
        }
      } else {
        const res = await fetch(`${apiBase}/${editing._id}`, {
          method: 'PUT',
          headers: authHeaders('application/json'),
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const j: { message?: string } | undefined = await res.json().catch(() => undefined);
          throw new Error(j?.message || 'Failed to update');
        }
      }
      setEditOpen(false);
      setEditing(null);
      setSuccess('Product updated');
      await fetchLists();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Update failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm('Delete this product?')) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (!res.ok) {
        const j: { message?: string } | undefined = await res.json().catch(() => undefined);
        throw new Error(j?.message || 'Failed to delete');
      }
      setSuccess('Product deleted');
      await fetchLists();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Delete failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (title: string, rows: Product[]) => (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
        <IconButton onClick={fetchLists} size="small" aria-label="refresh">
          <Refresh />
        </IconButton>
      </Box>
      <Box sx={{ px: 2, pb: 2 }}>
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            '& th, & td': { borderTop: `1px solid ${theme.palette.divider}`, p: 1.25, textAlign: 'left' },
            '& th': { fontWeight: 600, backgroundColor: theme.palette.action.hover },
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 280 }}>Name</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <Box sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>No items</Box>
                </td>
              </tr>
            )}
            {rows.map((p) => (
              <tr key={p._id}>
                <td>
                  <Stack spacing={0.2}>
                    <Typography sx={{ fontWeight: 500 }}>{p.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{p.slug}</Typography>
                  </Stack>
                </td>
                <td>{p.brand || '-'}</td>
                <td>{formatCurrency(p.price)}</td>
                <td>{typeof p.stock === 'number' ? p.stock : '-'}</td>
                <td>
                  <Chip size="small" label={p.isPublished ? 'Published' : 'Draft'} color={p.isPublished ? 'success' : 'default'} />
                </td>
                <td>
                  <Stack direction="row" spacing={1}>
                    <IconButton aria-label="edit" onClick={() => handleOpenEdit(p)} size="small">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDelete(p._id)} size="small" color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Products</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>Upload Product</Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <CircularProgress size={18} />
          <Typography variant="body2">Loading...</Typography>
        </Box>
      )}

      {renderTable('Published', products)}
      {renderTable('Drafts', drafts)}

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>Create Product</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {/* Basic Info */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Basic Information</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth required />
              <TextField label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} fullWidth />
            </Stack>
            <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline minRows={3} />
            
            {/* Pricing */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Pricing & Inventory</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Price *" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} fullWidth required />
              <TextField label="Compare at price" type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} fullWidth />
              <TextField label="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} fullWidth />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} fullWidth />
              <TextField label="Barcode" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} fullWidth />
              <TextField label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} fullWidth />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Tax Class" value={form.taxClass} onChange={(e) => setForm({ ...form, taxClass: e.target.value })} fullWidth />
              <Stack direction="row" alignItems="center" spacing={2}>
                <Chip label={form.trackInventory ? 'Track Inventory' : 'No Tracking'} color={form.trackInventory ? 'success' : 'default'} />
                <Button onClick={() => setForm({ ...form, trackInventory: !form.trackInventory })} variant="outlined" size="small">
                  {form.trackInventory ? 'Disable Tracking' : 'Enable Tracking'}
                </Button>
              </Stack>
            </Stack>

            {/* Categories & Tags */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Categories & Tags</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Categories (comma separated)"
                value={Array.isArray(form.categories) ? form.categories.join(', ') : form.categories}
                onChange={(e) => setForm({ ...form, categories: normalizeCsvInput(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Tags (comma separated)"
                value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags}
                onChange={(e) => setForm({ ...form, tags: normalizeCsvInput(e.target.value) })}
                fullWidth
              />
            </Stack>

            {/* Images */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Images</Typography>
            {/* Quick add removed; use the list below */}
            <Stack spacing={1}>
              {(form.imagesList || []).map((img, idx) => (
                <Stack key={idx} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                  <Box sx={{ width: 72, height: 56, borderRadius: 1, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
                    {img.url ? (
                      <img src={img.url} alt={img.alt || 'preview'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </Box>
                  <Button component="label" variant="outlined">
                    Select image
                    <input type="file" hidden accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      const imagesList = [...form.imagesList];
                      imagesList[idx] = { ...imagesList[idx], url, file };
                      setForm({ ...form, imagesList });
                    }} />
                  </Button>
                  <TextField label="Alt" value={img.alt} onChange={(e) => {
                    const imagesList = [...form.imagesList]; imagesList[idx] = { ...imagesList[idx], alt: e.target.value }; setForm({ ...form, imagesList });
                  }} fullWidth />
                  {/* publicId is set by backend after upload; we don't edit it here */}
                  <FormControlLabel control={<Checkbox checked={!!img.isPrimary} onChange={() => {
                    const imagesList = [...form.imagesList];
                    imagesList[idx] = { ...imagesList[idx], isPrimary: !imagesList[idx].isPrimary };
                    if (imagesList[idx].isPrimary) {
                      for (let i = 0; i < imagesList.length; i++) if (i !== idx) imagesList[i].isPrimary = false;
                    }
                    setForm({ ...form, imagesList });
                  }} />} label={img.isPrimary ? 'Primary' : 'Make Primary'} />
                  <Tooltip title="Move up">
                    <span>
                      <IconButton size="small" disabled={idx === 0} onClick={() => {
                        if (idx === 0) return;
                        const imagesList = [...form.imagesList];
                        const tmp = imagesList[idx - 1];
                        imagesList[idx - 1] = imagesList[idx];
                        imagesList[idx] = tmp;
                        setForm({ ...form, imagesList });
                      }}>
                        <ArrowUpward fontSize="inherit" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Move down">
                    <span>
                      <IconButton size="small" disabled={idx === form.imagesList.length - 1} onClick={() => {
                        if (idx === form.imagesList.length - 1) return;
                        const imagesList = [...form.imagesList];
                        const tmp = imagesList[idx + 1];
                        imagesList[idx + 1] = imagesList[idx];
                        imagesList[idx] = tmp;
                        setForm({ ...form, imagesList });
                      }}>
                        <ArrowDownward fontSize="inherit" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Button color="error" onClick={() => {
                    const imagesList = [...form.imagesList]; imagesList.splice(idx, 1); setForm({ ...form, imagesList });
                  }}>Remove</Button>
                </Stack>
              ))}
              <Button variant="outlined" onClick={() => setForm({ ...form, imagesList: [...(form.imagesList || []), { url: '', alt: '', publicId: '', isPrimary: false, file: null }] })}>Add image</Button>
            </Stack>

            {/* Physical Properties */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Physical Properties</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Weight" type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} fullWidth />
              <TextField label="Length" type="number" value={form.dimensionLength} onChange={(e) => setForm({ ...form, dimensionLength: e.target.value })} fullWidth />
              <TextField label="Width" type="number" value={form.dimensionWidth} onChange={(e) => setForm({ ...form, dimensionWidth: e.target.value })} fullWidth />
              <TextField label="Height" type="number" value={form.dimensionHeight} onChange={(e) => setForm({ ...form, dimensionHeight: e.target.value })} fullWidth />
              <TextField select label="Unit" value={form.dimensionUnit} onChange={(e) => setForm({ ...form, dimensionUnit: e.target.value })} fullWidth>
                <MenuItem value="cm">cm</MenuItem>
                <MenuItem value="in">in</MenuItem>
              </TextField>
            </Stack>

            {/* SEO */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>SEO</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="SEO Title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} fullWidth />
              <TextField label="SEO Keywords (comma separated)" value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} fullWidth />
            </Stack>
            <TextField label="SEO Description" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} fullWidth multiline minRows={2} />

            {/* Vendor & Origin */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Vendor & Origin</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Vendor" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} fullWidth />
              <TextField label="Country of Origin" value={form.countryOfOrigin} onChange={(e) => setForm({ ...form, countryOfOrigin: e.target.value })} fullWidth />
            </Stack>

            {/* Variants */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Variants</Typography>
            <Stack spacing={2}>
              {(form.variants || []).map((v, idx) => (
                <Box key={idx} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                    <TextField label="Variant name" value={v.name} onChange={(e) => {
                      const variants = [...form.variants]; variants[idx] = { ...variants[idx], name: e.target.value }; setForm({ ...form, variants });
                    }} fullWidth />
                    <TextField label="SKU" value={v.sku} onChange={(e) => {
                      const variants = [...form.variants]; variants[idx] = { ...variants[idx], sku: e.target.value }; setForm({ ...form, variants });
                    }} fullWidth />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                    <TextField label="Price" type="number" value={v.price} onChange={(e) => {
                      const variants = [...form.variants]; variants[idx] = { ...variants[idx], price: e.target.value }; setForm({ ...form, variants });
                    }} fullWidth />
                    <TextField label="Compare at price" type="number" value={v.compareAtPrice} onChange={(e) => {
                      const variants = [...form.variants]; variants[idx] = { ...variants[idx], compareAtPrice: e.target.value }; setForm({ ...form, variants });
                    }} fullWidth />
                    <TextField label="Stock" type="number" value={v.stock} onChange={(e) => {
                      const variants = [...form.variants]; variants[idx] = { ...variants[idx], stock: e.target.value }; setForm({ ...form, variants });
                    }} fullWidth />
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Chip label={v.isActive ? 'Active' : 'Inactive'} color={v.isActive ? 'success' : 'default'} />
                    <Button onClick={() => {
                      const variants = [...form.variants]; variants[idx] = { ...variants[idx], isActive: !variants[idx].isActive }; setForm({ ...form, variants });
                    }} variant="outlined" size="small">{v.isActive ? 'Deactivate' : 'Activate'}</Button>
                  </Stack>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Variant Images</Typography>
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    {(v.images || []).map((img, iIdx) => (
                      <Stack key={iIdx} direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <TextField label="URL" value={img.url} onChange={(e) => {
                          const variants = [...form.variants];
                          const imgs = [...(variants[idx].images || [])];
                          imgs[iIdx] = { ...imgs[iIdx], url: e.target.value };
                          variants[idx] = { ...variants[idx], images: imgs };
                          setForm({ ...form, variants });
                        }} fullWidth />
                        <TextField label="Alt" value={img.alt} onChange={(e) => {
                          const variants = [...form.variants];
                          const imgs = [...(variants[idx].images || [])];
                          imgs[iIdx] = { ...imgs[iIdx], alt: e.target.value };
                          variants[idx] = { ...variants[idx], images: imgs };
                          setForm({ ...form, variants });
                        }} fullWidth />
                        <Button color="error" onClick={() => {
                          const variants = [...form.variants];
                          const imgs = [...(variants[idx].images || [])];
                          imgs.splice(iIdx, 1);
                          variants[idx] = { ...variants[idx], images: imgs };
                          setForm({ ...form, variants });
                        }}>Remove</Button>
                      </Stack>
                    ))}
                    <Button onClick={() => {
                      const variants = [...form.variants];
                      const imgs = [...(variants[idx].images || [])];
                      imgs.push({ url: '', alt: '' });
                      variants[idx] = { ...variants[idx], images: imgs };
                      setForm({ ...form, variants });
                    }}>Add variant image</Button>
                  </Stack>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Attributes</Typography>
                  <Stack spacing={1}>
                    {(v.attributes || []).map((a, aIdx) => (
                      <Stack key={aIdx} direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <TextField label="Key" value={a.key} onChange={(e) => {
                          const variants = [...form.variants];
                          const attrs = [...(variants[idx].attributes || [])];
                          attrs[aIdx] = { ...attrs[aIdx], key: e.target.value };
                          variants[idx] = { ...variants[idx], attributes: attrs };
                          setForm({ ...form, variants });
                        }} fullWidth />
                        <TextField label="Value" value={a.value} onChange={(e) => {
                          const variants = [...form.variants];
                          const attrs = [...(variants[idx].attributes || [])];
                          attrs[aIdx] = { ...attrs[aIdx], value: e.target.value };
                          variants[idx] = { ...variants[idx], attributes: attrs };
                          setForm({ ...form, variants });
                        }} fullWidth />
                        <Button color="error" onClick={() => {
                          const variants = [...form.variants];
                          const attrs = [...(variants[idx].attributes || [])];
                          attrs.splice(aIdx, 1);
                          variants[idx] = { ...variants[idx], attributes: attrs };
                          setForm({ ...form, variants });
                        }}>Remove</Button>
                      </Stack>
                    ))}
                    <Button onClick={() => {
                      const variants = [...form.variants];
                      const attrs = [...(variants[idx].attributes || [])];
                      attrs.push({ key: '', value: '' });
                      variants[idx] = { ...variants[idx], attributes: attrs };
                      setForm({ ...form, variants });
                    }}>Add attribute</Button>
                  </Stack>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button color="error" onClick={() => {
                      const variants = [...form.variants];
                      variants.splice(idx, 1);
                      setForm({ ...form, variants });
                    }}>Remove variant</Button>
                  </Box>
                </Box>
              ))}
              <Button variant="outlined" onClick={() => setForm({ ...form, variants: [...(form.variants || []), { name: '', sku: '', price: '', compareAtPrice: '', stock: '', isActive: true, images: [], attributes: [] }] })}>Add variant</Button>
            </Stack>

            {/* Status & Visibility */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Status & Visibility</Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Chip label={form.isPublished ? 'Published' : 'Draft'} color={form.isPublished ? 'success' : 'default'} />
              <Button onClick={() => setForm({ ...form, isPublished: !form.isPublished })} variant="outlined" size="small">
                {form.isPublished ? 'Mark as Draft' : 'Publish'}
              </Button>
              <Chip label={form.isActive ? 'Active' : 'Inactive'} color={form.isActive ? 'success' : 'default'} />
              <Button onClick={() => setForm({ ...form, isActive: !form.isActive })} variant="outlined" size="small">
                {form.isActive ? 'Deactivate' : 'Activate'}
              </Button>
              <TextField select label="Visibility" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })} sx={{ minWidth: 120 }}>
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="hidden">Hidden</MenuItem>
              </TextField>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip label={form.shippingRequired ? 'Shipping Required' : 'Digital'} color={form.shippingRequired ? 'info' : 'default'} />
                <Button onClick={() => setForm({ ...form, shippingRequired: !form.shippingRequired })} variant="outlined" size="small">
                  {form.shippingRequired ? 'Mark as Digital' : 'Require Shipping'}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {/* Basic Info */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Basic Information</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth required />
              <TextField label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} fullWidth />
            </Stack>
            <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline minRows={3} />
            
            {/* Pricing */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Pricing & Inventory</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Price *" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} fullWidth required />
              <TextField label="Compare at price" type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} fullWidth />
              <TextField label="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} fullWidth />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} fullWidth />
              <TextField label="Barcode" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} fullWidth />
              <TextField label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} fullWidth />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Tax Class" value={form.taxClass} onChange={(e) => setForm({ ...form, taxClass: e.target.value })} fullWidth />
              <Stack direction="row" alignItems="center" spacing={2}>
                <Chip label={form.trackInventory ? 'Track Inventory' : 'No Tracking'} color={form.trackInventory ? 'success' : 'default'} />
                <Button onClick={() => setForm({ ...form, trackInventory: !form.trackInventory })} variant="outlined" size="small">
                  {form.trackInventory ? 'Disable Tracking' : 'Enable Tracking'}
                </Button>
              </Stack>
            </Stack>

            {/* Categories & Tags */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Categories & Tags</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Categories (comma separated)"
                value={displayCsv(form.categories)}
                onChange={(e) => setForm({ ...form, categories: normalizeCsvInput(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Tags (comma separated)"
                value={displayCsv(form.tags)}
                onChange={(e) => setForm({ ...form, tags: normalizeCsvInput(e.target.value) })}
                fullWidth
              />
            </Stack>

            {/* Images */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Images</Typography>
            <Stack spacing={1}>
              {(form.imagesList || []).map((img, idx) => (
                <Stack key={idx} direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                  <Box sx={{ width: 72, height: 56, borderRadius: 1, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
                    {img.url ? (
                      <img src={img.url} alt={img.alt || 'preview'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </Box>
                  <Button component="label" variant="outlined">
                    Select image
                    <input type="file" hidden accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      const imagesList = [...form.imagesList];
                      imagesList[idx] = { ...imagesList[idx], url, file };
                      setForm({ ...form, imagesList });
                    }} />
                  </Button>
                  <TextField label="Alt" value={img.alt} onChange={(e) => {
                    const imagesList = [...form.imagesList]; imagesList[idx] = { ...imagesList[idx], alt: e.target.value }; setForm({ ...form, imagesList });
                  }} fullWidth />
                  {/* publicId is set by backend after upload; we don't edit it here */}
                  <FormControlLabel control={<Checkbox checked={!!img.isPrimary} onChange={() => {
                    const imagesList = [...form.imagesList];
                    imagesList[idx] = { ...imagesList[idx], isPrimary: !imagesList[idx].isPrimary };
                    if (imagesList[idx].isPrimary) {
                      for (let i = 0; i < imagesList.length; i++) if (i !== idx) imagesList[i].isPrimary = false;
                    }
                    setForm({ ...form, imagesList });
                  }} />} label={img.isPrimary ? 'Primary' : 'Make Primary'} />
                  <Tooltip title="Move up">
                    <span>
                      <IconButton size="small" disabled={idx === 0} onClick={() => {
                        if (idx === 0) return;
                        const imagesList = [...form.imagesList];
                        const tmp = imagesList[idx - 1];
                        imagesList[idx - 1] = imagesList[idx];
                        imagesList[idx] = tmp;
                        setForm({ ...form, imagesList });
                      }}>
                        <ArrowUpward fontSize="inherit" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Move down">
                    <span>
                      <IconButton size="small" disabled={idx === form.imagesList.length - 1} onClick={() => {
                        if (idx === form.imagesList.length - 1) return;
                        const imagesList = [...form.imagesList];
                        const tmp = imagesList[idx + 1];
                        imagesList[idx + 1] = imagesList[idx];
                        imagesList[idx] = tmp;
                        setForm({ ...form, imagesList });
                      }}>
                        <ArrowDownward fontSize="inherit" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Button color="error" onClick={() => {
                    const imagesList = [...form.imagesList]; imagesList.splice(idx, 1); setForm({ ...form, imagesList });
                  }}>Remove</Button>
                </Stack>
              ))}
              <Button variant="outlined" onClick={() => setForm({ ...form, imagesList: [...(form.imagesList || []), { url: '', alt: '', publicId: '', isPrimary: false, file: null }] })}>Add image</Button>
            </Stack>

            {/* Physical Properties */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Physical Properties</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Weight" type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} fullWidth />
              <TextField label="Length" type="number" value={form.dimensionLength} onChange={(e) => setForm({ ...form, dimensionLength: e.target.value })} fullWidth />
              <TextField label="Width" type="number" value={form.dimensionWidth} onChange={(e) => setForm({ ...form, dimensionWidth: e.target.value })} fullWidth />
              <TextField label="Height" type="number" value={form.dimensionHeight} onChange={(e) => setForm({ ...form, dimensionHeight: e.target.value })} fullWidth />
              <TextField select label="Unit" value={form.dimensionUnit} onChange={(e) => setForm({ ...form, dimensionUnit: e.target.value })} fullWidth>
                <MenuItem value="cm">cm</MenuItem>
                <MenuItem value="in">in</MenuItem>
              </TextField>
            </Stack>

            {/* SEO */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>SEO</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="SEO Title" value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} fullWidth />
              <TextField label="SEO Keywords (comma separated)" value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} fullWidth />
            </Stack>
            <TextField label="SEO Description" value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} fullWidth multiline minRows={2} />

            {/* Vendor & Origin */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Vendor & Origin</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Vendor" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} fullWidth />
              <TextField label="Country of Origin" value={form.countryOfOrigin} onChange={(e) => setForm({ ...form, countryOfOrigin: e.target.value })} fullWidth />
            </Stack>

            {/* Variants */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Variants</Typography>
            <Stack spacing={2}>
              {(form.variants || []).map((v, idx) => (
                <Box key={idx} sx={{ p: 2, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                    <TextField label="Variant name" value={v.name} onChange={(e) => {
                      const variants = [...form.variants]; variants[idx] = { ...variants[idx], name: e.target.value }; setForm({ ...form, variants });
                    }} fullWidth />
                    <TextField label="SKU" value={v.sku} onChange={(e) => {
                      const variants = [...form.variants]; variants[idx] = { ...variants[idx], sku: e.target.value }; setForm({ ...form, variants });
                    }} fullWidth />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                    <TextField label="Price" type="number" value={v.price} onChange={(e) => {
                      const variants = [...form.variants]; variants[idx] = { ...variants[idx], price: e.target.value }; setForm({ ...form, variants });
                    }} fullWidth />
                    <TextField label="Stock" type="number" value={v.stock} onChange={(e) => {
                      const variants = [...form.variants]; variants[idx] = { ...variants[idx], stock: e.target.value }; setForm({ ...form, variants });
                    }} fullWidth />
                  </Stack>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Attributes</Typography>
                  <Stack spacing={1}>
                    {(v.attributes || []).map((a, aIdx) => (
                      <Stack key={aIdx} direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <TextField label="Key" value={a.key} onChange={(e) => {
                          const variants = [...form.variants];
                          const attrs = [...(variants[idx].attributes || [])];
                          attrs[aIdx] = { ...attrs[aIdx], key: e.target.value };
                          variants[idx] = { ...variants[idx], attributes: attrs };
                          setForm({ ...form, variants });
                        }} fullWidth />
                        <TextField label="Value" value={a.value} onChange={(e) => {
                          const variants = [...form.variants];
                          const attrs = [...(variants[idx].attributes || [])];
                          attrs[aIdx] = { ...attrs[aIdx], value: e.target.value };
                          variants[idx] = { ...variants[idx], attributes: attrs };
                          setForm({ ...form, variants });
                        }} fullWidth />
                        <Button color="error" onClick={() => {
                          const variants = [...form.variants];
                          const attrs = [...(variants[idx].attributes || [])];
                          attrs.splice(aIdx, 1);
                          variants[idx] = { ...variants[idx], attributes: attrs };
                          setForm({ ...form, variants });
                        }}>Remove</Button>
                      </Stack>
                    ))}
                    <Button onClick={() => {
                      const variants = [...form.variants];
                      const attrs = [...(variants[idx].attributes || [])];
                      attrs.push({ key: '', value: '' });
                      variants[idx] = { ...variants[idx], attributes: attrs };
                      setForm({ ...form, variants });
                    }}>Add attribute</Button>
                  </Stack>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button color="error" onClick={() => {
                      const variants = [...form.variants];
                      variants.splice(idx, 1);
                      setForm({ ...form, variants });
                    }}>Remove variant</Button>
                  </Box>
                </Box>
              ))}
              <Button variant="outlined" onClick={() => setForm({ ...form, variants: [...(form.variants || []), { name: '', sku: '', price: '', compareAtPrice: '', stock: '', isActive: true, images: [], attributes: [] }] })}>Add variant</Button>
            </Stack>

            {/* Status & Visibility */}
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>Status & Visibility</Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Chip label={form.isPublished ? 'Published' : 'Draft'} color={form.isPublished ? 'success' : 'default'} />
              <Button onClick={() => setForm({ ...form, isPublished: !form.isPublished })} variant="outlined" size="small">
                {form.isPublished ? 'Mark as Draft' : 'Publish'}
              </Button>
              <TextField select label="Visibility" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })} sx={{ minWidth: 120 }}>
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="hidden">Hidden</MenuItem>
              </TextField>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip label={form.shippingRequired ? 'Shipping Required' : 'Digital'} color={form.shippingRequired ? 'info' : 'default'} />
                <Button onClick={() => setForm({ ...form, shippingRequired: !form.shippingRequired })} variant="outlined" size="small">
                  {form.shippingRequired ? 'Mark as Digital' : 'Require Shipping'}
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
    </Box>
  );
}
