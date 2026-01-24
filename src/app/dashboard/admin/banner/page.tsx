'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Alert,
  useTheme,
  FormControlLabel,
  Checkbox,
  Stack,
  Grid,
  MenuItem,
  Snackbar,
  Paper,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Refresh,
  Link as LinkIcon,
  CalendarToday,
  Visibility,
  VisibilityOff,
  CloudUpload,
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

interface BannerImage {
  url: string;
  alt?: string;
  publicId?: string;
}

interface Banner {
  _id: string;
  title: string;
  description: string;
  image: BannerImage;
  order?: number;
  startDate?: string;
  endDate?: string;
  isDefault: boolean;
  isActive: boolean;
  link?: string;
  target?: '_self' | '_blank';
  createdAt: string;
  updatedAt: string;
}

export default function BannerPage() {
  const theme = useTheme();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    image: null as File | null,
    order: 0,
    startDate: '',
    endDate: '',
    isDefault: false,
    isActive: true,
    link: '',
    target: '_self' as '_self' | '_blank',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const apiBase = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/banners`;

  const authHeaders = useCallback((contentType?: string): HeadersInit => {
    const token = Cookies.get('authToken');
    const headers: Record<string, string> = {};
    if (contentType) headers['Content-Type'] = contentType;
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, []);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${apiBase}?page=1&limit=50`, {
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error('Failed to load banners');
      const data = await response.json();
      setBanners(data.items || data.data || []);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiBase, authHeaders]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      image: null,
      order: 0,
      startDate: '',
      endDate: '',
      isDefault: false,
      isActive: true,
      link: '',
      target: '_self',
    });
    setImagePreview(null);
  };

  const handleImageChange = (file: File) => {
    setForm({ ...form, image: file });
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageChange(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: null });
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const handleCreate = async () => {
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!form.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!form.image) {
      setError('Image is required');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      formData.append('image', form.image);
      formData.append('order', String(form.order));
      if (form.startDate && !form.isDefault) {
        formData.append('startDate', new Date(form.startDate).toISOString());
      }
      if (form.endDate && !form.isDefault) {
        formData.append('endDate', new Date(form.endDate).toISOString());
      }
      formData.append('isDefault', String(form.isDefault));
      formData.append('isActive', String(form.isActive));
      if (form.link) formData.append('link', form.link);
      formData.append('target', form.target);

      const response = await fetch(apiBase, {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create banner');
      }

      setSuccess('Banner created successfully!');
      setCreateOpen(false);
      resetForm();
      await fetchBanners();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to create banner';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setForm({
      title: banner.title,
      description: banner.description,
      image: null,
      order: banner.order || 0,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().slice(0, 16) : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().slice(0, 16) : '',
      isDefault: banner.isDefault,
      isActive: banner.isActive,
      link: banner.link || '',
      target: banner.target || '_self',
    });
    setImagePreview(banner.image.url);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!form.description.trim()) {
      setError('Description is required');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      if (!selectedBanner) return;

      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      formData.append('order', String(form.order));
      if (form.image) {
        formData.append('image', form.image);
      }
      if (form.startDate && !form.isDefault) {
        formData.append('startDate', new Date(form.startDate).toISOString());
      }
      if (form.endDate && !form.isDefault) {
        formData.append('endDate', new Date(form.endDate).toISOString());
      }
      formData.append('isDefault', String(form.isDefault));
      formData.append('isActive', String(form.isActive));
      if (form.link) formData.append('link', form.link);
      formData.append('target', form.target);

      const response = await fetch(`${apiBase}/${selectedBanner._id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update banner');
      }

      setSuccess('Banner updated successfully!');
      setEditOpen(false);
      setSelectedBanner(null);
      resetForm();
      await fetchBanners();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to update banner';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBanner) return;

    try {
      setDeletingId(selectedBanner._id);
      setError(null);

      const response = await fetch(`${apiBase}/${selectedBanner._id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete banner');
      }

      setSuccess('Banner deleted successfully!');
      setDeleteOpen(false);
      setSelectedBanner(null);
      await fetchBanners();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to delete banner';
      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const isBannerActive = (banner: Banner) => {
    if (!banner.isActive) return false;
    if (banner.isDefault) return true;
    if (!banner.startDate || !banner.endDate) return false;
    const now = new Date();
    const start = new Date(banner.startDate);
    const end = new Date(banner.endDate);
    return now >= start && now <= end;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Banner Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchBanners}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              resetForm();
              setCreateOpen(true);
            }}
          >
            Create Banner
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        </Snackbar>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : banners.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No banners found. Create your first banner!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {banners.map((banner) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={banner._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: `2px solid ${isBannerActive(banner) ? theme.palette.success.main : theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={banner.image?.url || '/placeholder-image.jpg'}
                      alt={banner.image?.alt || banner.title || 'Banner'}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1,
                        flexDirection: 'column',
                      }}
                    >
                      {banner.isDefault && (
                        <Chip label="Default" color="primary" size="small" />
                      )}
                      {isBannerActive(banner) ? (
                        <Chip
                          icon={<Visibility />}
                          label="Active"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          icon={<VisibilityOff />}
                          label="Inactive"
                          color="default"
                          size="small"
                        />
                      )}
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {banner.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {banner.description}
                    </Typography>
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        <CalendarToday sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                        {banner.isDefault
                          ? 'Always Active'
                          : `${formatDate(banner.startDate)} - ${formatDate(banner.endDate)}`}
                      </Typography>
                      {banner.link && (
                        <Typography variant="caption" color="text.secondary">
                          <LinkIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                          {banner.link}
                        </Typography>
                      )}
                      {banner.order !== undefined && (
                        <Typography variant="caption" color="text.secondary">
                          Order: {banner.order}
                        </Typography>
                      )}
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(banner)}
                        fullWidth
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => {
                          setSelectedBanner(banner);
                          setDeleteOpen(true);
                        }}
                        fullWidth
                      >
                        Delete
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Banner</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              error={!form.title.trim()}
              helperText={!form.title.trim() ? 'Title is required' : ''}
            />
            <TextField
              label="Description"
              fullWidth
              required
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              error={!form.description.trim()}
              helperText={!form.description.trim() ? 'Description is required' : ''}
            />
            <TextField
              label="Order"
              type="number"
              fullWidth
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              inputProps={{ min: 0, max: 3 }}
              helperText="Display order (0-3)"
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                Image (required)
              </Typography>
              <Box
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                sx={{
                  border: `2px dashed ${dragActive ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: dragActive
                    ? theme.palette.primary.light + '10'
                    : theme.palette.action.hover,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  mb: 2,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: theme.palette.primary.light + '10',
                  },
                }}
                onClick={() => document.getElementById('banner-image-upload')?.click()}
              >
                <input
                  id="banner-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />
                <CloudUpload sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select an image from your computer or device
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Supported formats: JPG, PNG, GIF, WebP
                </Typography>
              </Box>
              {imagePreview && (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={imagePreview}
                    alt="Preview"
                    sx={{ objectFit: 'cover', borderRadius: 1 }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'error.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'error.dark' },
                    }}
                    onClick={removeImage}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                />
              }
              label="Default Banner (always active)"
            />
            {!form.isDefault && (
              <>
                <TextField
                  label="Start Date"
                  type="datetime-local"
                  fullWidth
                  required
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="datetime-local"
                  fullWidth
                  required
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
              }
              label="Active"
            />
            <TextField
              label="Link URL (optional)"
              fullWidth
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://example.com"
            />
            <TextField
              select
              label="Link Target"
              fullWidth
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value as '_self' | '_blank' })}
            >
              <MenuItem value="_self">Same Window</MenuItem>
              <MenuItem value="_blank">New Window</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={uploading || !form.title.trim() || !form.description.trim() || !form.image}
          >
            {uploading ? <CircularProgress size={20} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Banner</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              error={!form.title.trim()}
              helperText={!form.title.trim() ? 'Title is required' : ''}
            />
            <TextField
              label="Description"
              fullWidth
              required
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              error={!form.description.trim()}
              helperText={!form.description.trim() ? 'Description is required' : ''}
            />
            <TextField
              label="Order"
              type="number"
              fullWidth
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
              inputProps={{ min: 0, max: 3 }}
              helperText="Display order (0-3)"
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Current Image
              </Typography>
              {imagePreview && !form.image && (
                <Box sx={{ mb: 2 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={imagePreview}
                    alt="Current banner"
                    sx={{ objectFit: 'cover', borderRadius: 1 }}
                  />
                </Box>
              )}
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                Upload New Image (optional)
              </Typography>
              <Box
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                sx={{
                  border: `2px dashed ${dragActive ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  bgcolor: dragActive
                    ? theme.palette.primary.light + '10'
                    : theme.palette.action.hover,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  mb: 2,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: theme.palette.primary.light + '10',
                  },
                }}
                onClick={() => document.getElementById('banner-image-upload-edit')?.click()}
              >
                <input
                  id="banner-image-upload-edit"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />
                <CloudUpload sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select an image from your computer or device
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Supported formats: JPG, PNG, GIF, WebP
                </Typography>
              </Box>
              {form.image && imagePreview && (
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={imagePreview}
                    alt="New preview"
                    sx={{ objectFit: 'cover', borderRadius: 1 }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'error.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'error.dark' },
                    }}
                    onClick={removeImage}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                />
              }
              label="Default Banner (always active)"
            />
            {!form.isDefault && (
              <>
                <TextField
                  label="Start Date"
                  type="datetime-local"
                  fullWidth
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="datetime-local"
                  fullWidth
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
              }
              label="Active"
            />
            <TextField
              label="Link URL (optional)"
              fullWidth
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://example.com"
            />
            <TextField
              select
              label="Link Target"
              fullWidth
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value as '_self' | '_blank' })}
            >
              <MenuItem value="_self">Same Window</MenuItem>
              <MenuItem value="_blank">New Window</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={uploading || !form.title.trim() || !form.description.trim()}
          >
            {uploading ? <CircularProgress size={20} /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Banner</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this banner? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deletingId === selectedBanner?._id}
          >
            {deletingId === selectedBanner?._id ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
