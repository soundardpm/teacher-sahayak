# Frontend Deployment Guide - Cloud Run

This guide provides step-by-step instructions for deploying frontend code changes to Google Cloud Run.

## Prerequisites

- Google Cloud CLI installed and configured
- Docker installed (optional for local testing)
- Access to Google Cloud project: `aasiriyar-ai`
- Required APIs enabled:
  - Cloud Build API
  - Container Registry API
  - Cloud Run API

## Quick Deployment Steps

### Method 1: Direct Cloud Run Deployment (Recommended)

This is the fastest method for deploying code changes:

```bash
# 1. Navigate to the portal directory
cd "c:\Soundar\Ideas\Aasiriyar AI\demo\teacher-sahayak\src\portal"

# 2. Deploy directly to Cloud Run
gcloud run deploy aasiriyarai-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10
```

### Method 2: Using Cloud Build (For CI/CD)

Use this method when you want to use the existing `cloudbuild.yaml`:

```bash
# 1. Navigate to the portal directory
cd "c:\Soundar\Ideas\Aasiriyar AI\demo\teacher-sahayak\src\portal"

# 2. Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml .
```

## Detailed Step-by-Step Process

### Step 1: Prepare Your Environment

```bash
# Check if Google Cloud CLI is installed
gcloud --version

# Verify you're authenticated
gcloud auth list

# Confirm current project
gcloud config get-value project
```

### Step 2: Navigate to Project Directory

```bash
# Change to the frontend directory
cd "c:\Soundar\Ideas\Aasiriyar AI\demo\teacher-sahayak\src\portal"
```

### Step 3: Test Your Changes Locally (Optional)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (to test build process)
npm run build
```

### Step 4: Deploy to Cloud Run

Choose one of the deployment methods above. The direct deployment is recommended for development.

### Step 5: Verify Deployment

```bash
# Check service status
gcloud run services describe aasiriyarai-frontend --region us-central1

# List all Cloud Run services
gcloud run services list --region us-central1

# View deployment logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=aasiriyarai-frontend" --limit 50 --format json
```

## Current Deployment Information

- **Service Name**: `aasiriyarai-frontend`
- **Service URL**: https://aasiriyarai-frontend-903188585535.us-central1.run.app
- **Region**: us-central1
- **Project**: aasiriyar-ai

## Environment Variables (if needed)

If your application requires environment variables, add them during deployment:

```bash
gcloud run deploy aasiriyarai-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars="NODE_ENV=production,API_URL=your-api-url"
```

## Troubleshooting

### Common Issues and Solutions

1. **Build Failures**
   ```bash
   # Check build logs
   gcloud logging read "resource.type=build" --limit 10
   ```

2. **Service Not Responding**
   ```bash
   # Check service logs
   gcloud logging read "resource.type=cloud_run_revision" --limit 50
   ```

3. **Port Issues**
   - Ensure your `Dockerfile` exposes port 3000
   - Verify `next.config.ts` has `output: 'standalone'`

4. **Memory/CPU Issues**
   ```bash
   # Update resource limits
   gcloud run services update aasiriyarai-frontend \
     --region us-central1 \
     --memory 2Gi \
     --cpu 2
   ```

## File Structure Requirements

Ensure these files are properly configured:

### `Dockerfile`
- Uses multi-stage build
- Exposes port 3000
- Has standalone output

### `next.config.ts`
```typescript
const nextConfig: NextConfig = {
  output: 'standalone', // Required for Cloud Run
  // ... other config
};
```

### `package.json`
- Contains proper build scripts
- Has all required dependencies

## CI/CD with Cloud Build

Your `cloudbuild.yaml` is configured for automated deployments:

```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/aasiriyarai:$BUILD_ID', '.']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/aasiriyarai:$BUILD_ID']
  
  - name: 'gcr.io/cloud-builders/gcloud'
    args: [
      'run', 'deploy', 'aasiriyarai',
      '--image', 'gcr.io/$PROJECT_ID/aasiriyarai:$BUILD_ID',
      '--region', 'us-central1',
      '--platform', 'managed',
      '--allow-unauthenticated'
    ]
```

## Quick Commands Reference

```bash
# Deploy latest changes
gcloud run deploy aasiriyarai-frontend --source . --region us-central1 --allow-unauthenticated

# Check service status
gcloud run services describe aasiriyarai-frontend --region us-central1

# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=aasiriyarai-frontend" --limit 20

# Update service configuration
gcloud run services update aasiriyarai-frontend --region us-central1 --memory 2Gi

# Delete service (if needed)
gcloud run services delete aasiriyarai-frontend --region us-central1
```

## Best Practices

1. **Version Control**: Always commit your changes before deploying
2. **Testing**: Test locally before deploying to production
3. **Environment Variables**: Use Cloud Run environment variables for configuration
4. **Monitoring**: Set up Cloud Monitoring for your service
5. **Security**: Use IAM roles and service accounts appropriately
6. **Cost Optimization**: Set appropriate CPU and memory limits

## Next Steps

1. Set up automated deployments with GitHub Actions or Cloud Build triggers
2. Configure custom domain and SSL certificates
3. Set up monitoring and alerting
4. Implement blue-green deployments for zero-downtime updates

---

**Last Updated**: July 27, 2025
**Service URL**: https://aasiriyarai-frontend-903188585535.us-central1.run.app
