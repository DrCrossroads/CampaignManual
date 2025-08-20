# Object Store User Manual

Complete user guide for the Novarad Object Store system.

## Table of Contents

- [Interface Overview](#interface-overview)
- [Bucket Management](#bucket-management)
- [Object Operations](#object-operations)
- [Access Control](#access-control)
- [Data Lifecycle Management](#data-lifecycle-management)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [API Usage](#api-usage)
- [Troubleshooting](#troubleshooting)

## Interface Overview

The Object Store provides multiple interfaces for data management and access.

**Management Console:**

- **Dashboard**: System overview and health status
- **Bucket Browser**: Visual file and folder management
- **User Management**: Account and permission administration
- **Analytics**: Usage statistics and performance metrics
- **Settings**: System configuration and preferences

**Command Line Interface:**

- **Bucket Operations**: Create, list, and manage buckets
- **Object Operations**: Upload, download, and manipulate objects
- **Access Control**: Manage permissions and policies
- **Administrative Tasks**: System maintenance and monitoring

## Bucket Management

### Creating Buckets

**Via Management Console:**

1. Navigate to "Buckets" in the main menu
1. Click "Create New Bucket"
1. Configure bucket settings:
   - **Bucket Name**: Unique identifier (DNS-compliant)
   - **Region**: Geographic location for data storage
   - **Storage Class**: Hot, warm, or cold storage tier
   - **Access Permissions**: Public or private access
   - **Encryption**: Encryption settings and key management

1. Set advanced options:
   - **Versioning**: Enable object version control
   - **Lifecycle Rules**: Automated data management policies
   - **Logging**: Access and audit logging configuration
   - **Notification**: Event notification settings

**Via Command Line:**

```bash
# Create basic bucket
objectstore-cli bucket create healthcare-images \
  --region us-east-1 \
  --storage-class hot

# Create bucket with advanced settings
objectstore-cli bucket create patient-archives \
  --region us-east-1 \
  --storage-class cold \
  --versioning enabled \
  --encryption aes256 \
  --lifecycle-policy archive-policy.json
```

### Bucket Configuration

**Storage Classes:**

- **Hot Storage**: Frequently accessed data (millisecond access)
- **Warm Storage**: Moderately accessed data (second access)
- **Cold Storage**: Infrequently accessed data (minute access)
- **Archive**: Long-term storage (hour access)

**Access Policies:**

```json
{
  "Version": "2023-01-01",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Group": ["radiologists"]
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:objectstore:s3:::healthcare-images/*"
    }
  ]
}
```

## Object Operations

### Uploading Objects

**Single File Upload:**

```bash
# Upload single file
objectstore-cli object put \
  --bucket healthcare-images \
  --key "studies/ct/2024/patient-123/study-001.dcm" \
  --file "/local/path/study-001.dcm" \
  --metadata "patient-id=123,study-type=ct,date=2024-01-15"
```

**Batch Upload:**

```bash
# Upload directory
objectstore-cli object sync \
  --source "/local/dicom/studies/" \
  --destination "s3://healthcare-images/studies/" \
  --recursive \
  --exclude "*.tmp" \
  --include "*.dcm"
```

**Multipart Upload for Large Files:**

```bash
# Upload large file with multipart
objectstore-cli object put \
  --bucket healthcare-images \
  --key "mri/large-study.zip" \
  --file "/path/to/large-study.zip" \
  --multipart \
  --part-size 100MB
```

### Downloading Objects

**Single File Download:**

```bash
# Download specific object
objectstore-cli object get \
  --bucket healthcare-images \
  --key "studies/ct/2024/patient-123/study-001.dcm" \
  --output "/local/download/study-001.dcm"
```

**Batch Download:**

```bash
# Download directory
objectstore-cli object sync \
  --source "s3://healthcare-images/studies/ct/2024/" \
  --destination "/local/ct-studies/" \
  --recursive \
  --filter "patient-123"
```

### Object Metadata

**Setting Metadata:**

```bash
# Add metadata to object
objectstore-cli object metadata set \
  --bucket healthcare-images \
  --key "studies/ct/study-001.dcm" \
  --metadata '{
    "patient-id": "123",
    "study-date": "2024-01-15",
    "modality": "CT",
    "department": "radiology",
    "retention-years": "7"
  }'
```

**Querying Metadata:**

```bash
# Get object metadata
objectstore-cli object metadata get \
  --bucket healthcare-images \
  --key "studies/ct/study-001.dcm"

# Search by metadata
objectstore-cli object search \
  --bucket healthcare-images \
  --metadata-filter "modality=CT AND study-date>=2024-01-01"
```

## Access Control

### User Management

**Creating Users:**

```bash
# Create new user
objectstore-cli user create radiologist-001 \
  --full-name "Dr. John Smith" \
  --email "jsmith@hospital.com" \
  --groups "radiologists,department-radiology"

# Generate access keys
objectstore-cli user create-access-key radiologist-001
```

**User Groups:**

```bash
# Create user group
objectstore-cli group create radiologists \
  --description "Radiologists with read/write access to imaging data"

# Add user to group
objectstore-cli group add-user radiologists radiologist-001

# Assign permissions to group
objectstore-cli group attach-policy radiologists \
  --policy-document radiologist-access-policy.json
```

### Permission Policies

**Bucket-Level Policies:**

```json
{
  "Version": "2023-01-01",
  "Statement": [
    {
      "Sid": "RadiologyAccess",
      "Effect": "Allow",
      "Principal": {
        "Group": ["radiologists"]
      },
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:objectstore:s3:::healthcare-images"
    },
    {
      "Sid": "ObjectAccess",
      "Effect": "Allow",
      "Principal": {
        "Group": ["radiologists"]
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:objectstore:s3:::healthcare-images/*",
      "Condition": {
        "StringLike": {
          "objectstore:x-amz-metadata-department": "radiology"
        }
      }
    }
  ]
}
```

**Time-Based Access:**

```json
{
  "Version": "2023-01-01",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "User": ["temp-researcher"]
      },
      "Action": "s3:GetObject",
      "Resource": "arn:objectstore:s3:::research-data/*",
      "Condition": {
        "DateGreaterThan": {
          "aws:CurrentTime": "2024-01-01T00:00:00Z"
        },
        "DateLessThan": {
          "aws:CurrentTime": "2024-12-31T23:59:59Z"
        }
      }
    }
  ]
}
```

## Data Lifecycle Management

### Lifecycle Policies

**Automatic Tiering:**

```json
{
  "Rules": [
    {
      "ID": "HealthcareDataLifecycle",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "studies/"
      },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "WARM"
        },
        {
          "Days": 365,
          "StorageClass": "COLD"
        },
        {
          "Days": 2555,
          "StorageClass": "ARCHIVE"
        }
      ],
      "Expiration": {
        "Days": 2920
      }
    }
  ]
}
```

**Policy Application:**

```bash
# Apply lifecycle policy to bucket
objectstore-cli bucket lifecycle put \
  --bucket healthcare-images \
  --lifecycle-configuration lifecycle-policy.json

# View current lifecycle policies
objectstore-cli bucket lifecycle get \
  --bucket healthcare-images
```

### Version Management

**Enable Versioning:**

```bash
# Enable versioning on bucket
objectstore-cli bucket versioning enable \
  --bucket healthcare-images

# Upload new version of object
objectstore-cli object put \
  --bucket healthcare-images \
  --key "studies/ct/study-001.dcm" \
  --file "/path/to/updated-study-001.dcm"
```

**Version Operations:**

```bash
# List object versions
objectstore-cli object versions list \
  --bucket healthcare-images \
  --key "studies/ct/study-001.dcm"

# Get specific version
objectstore-cli object get \
  --bucket healthcare-images \
  --key "studies/ct/study-001.dcm" \
  --version-id "abc123def456" \
  --output "/path/to/old-version.dcm"

# Delete specific version
objectstore-cli object delete \
  --bucket healthcare-images \
  --key "studies/ct/study-001.dcm" \
  --version-id "abc123def456"
```

## Monitoring and Analytics

### Usage Analytics

**Storage Metrics:**

```bash
# Get bucket usage statistics
objectstore-cli analytics storage \
  --bucket healthcare-images \
  --start-date "2024-01-01" \
  --end-date "2024-01-31"

# Get object count by storage class
objectstore-cli analytics objects \
  --bucket healthcare-images \
  --group-by storage-class
```

**Access Patterns:**

```bash
# Analyze access patterns
objectstore-cli analytics access \
  --bucket healthcare-images \
  --start-date "2024-01-01" \
  --metrics "requests,data-transfer,unique-users"

# Generate usage report
objectstore-cli analytics report \
  --bucket healthcare-images \
  --report-type monthly \
  --format pdf \
  --output healthcare-usage-report.pdf
```

### Performance Monitoring

**Latency Metrics:**

```bash
# Monitor request latency
objectstore-cli monitor latency \
  --bucket healthcare-images \
  --operation-types "GET,PUT" \
  --duration 24h

# Check throughput statistics
objectstore-cli monitor throughput \
  --bucket healthcare-images \
  --group-by hour
```

**Health Checks:**

```bash
# System health status
objectstore-cli system health

# Check cluster status
objectstore-cli cluster status

# Monitor replication status
objectstore-cli replication status \
  --bucket healthcare-images
```

## API Usage

### RESTful API

**Authentication:**

```bash
# Using API keys
curl -H "Authorization: Bearer your-api-key" \
     -H "Content-Type: application/json" \
     https://objectstore.hospital.com/api/v1/buckets
```

**Bucket Operations:**

```bash
# List buckets
curl -X GET \
     -H "Authorization: Bearer your-api-key" \
     https://objectstore.hospital.com/api/v1/buckets

# Create bucket
curl -X POST \
     -H "Authorization: Bearer your-api-key" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "new-bucket",
       "region": "us-east-1",
       "storage_class": "hot"
     }' \
     https://objectstore.hospital.com/api/v1/buckets
```

**Object Operations:**

```bash
# Upload object
curl -X PUT \
     -H "Authorization: Bearer your-api-key" \
     -H "Content-Type: application/octet-stream" \
     --data-binary @study-001.dcm \
     https://objectstore.hospital.com/api/v1/buckets/healthcare-images/objects/study-001.dcm

# Download object
curl -X GET \
     -H "Authorization: Bearer your-api-key" \
     -o study-001.dcm \
     https://objectstore.hospital.com/api/v1/buckets/healthcare-images/objects/study-001.dcm
```

### S3 Compatible API

**Using AWS CLI:**

```bash
# Configure AWS CLI for Object Store
aws configure set aws_access_key_id your-access-key
aws configure set aws_secret_access_key PLACEHOLDER_SECRET_KEY
aws configure set default.region us-east-1
aws configure set default.s3.endpoint_url https://objectstore.hospital.com

# Use standard S3 commands
aws s3 ls s3://healthcare-images/
aws s3 cp study-001.dcm s3://healthcare-images/studies/
aws s3 sync /local/dicom/ s3://healthcare-images/studies/
```

**Python SDK Example:**

```python
import boto3

# Configure client
client = boto3.client(
    's3',
    endpoint_url='https://objectstore.hospital.com',
    aws_access_key_id='your-access-key',
    aws_secret_access_key='PLACEHOLDER_SECRET_KEY',
    region_name='us-east-1'
)

# Upload object
with open('study-001.dcm', 'rb') as f:
    client.put_object(
        Bucket='healthcare-images',
        Key='studies/ct/study-001.dcm',
        Body=f,
        Metadata={
            'patient-id': '123',
            'study-type': 'CT',
            'department': 'radiology'
        }
    )

# Download object
response = client.get_object(
    Bucket='healthcare-images',
    Key='studies/ct/study-001.dcm'
)

with open('downloaded-study.dcm', 'wb') as f:
    f.write(response['Body'].read())
```

## Troubleshooting

### Common Issues

**Connection Problems:**

```bash
# Test connectivity
objectstore-cli system ping

# Check DNS resolution
nslookup objectstore.hospital.com

# Verify SSL certificate
openssl s_client -connect objectstore.hospital.com:443
```

**Performance Issues:**

```bash
# Check cluster performance
objectstore-cli monitor performance --duration 1h

# Analyze slow requests
objectstore-cli logs analyze --filter "duration>5s" --last 24h

# Check storage utilization
objectstore-cli system storage-usage
```

**Access Denied Errors:**

```bash
# Verify user permissions
objectstore-cli user permissions check \
  --user username \
  --bucket bucket-name \
  --action s3:GetObject

# Check policy syntax
objectstore-cli policy validate --policy-file policy.json

# Debug access issues
objectstore-cli access-logs search \
  --user username \
  --bucket bucket-name \
  --status-code 403
```

### Diagnostic Commands

**System Information:**

```bash
# System status overview
objectstore-cli system info

# Check service health
objectstore-cli service status --all

# View error logs
objectstore-cli logs error --last 1h

# Generate diagnostic bundle
objectstore-cli support diagnostic-bundle \
  --output diagnostic-$(date +%Y%m%d).tar.gz
```

**Network Diagnostics:**

```bash
# Test network latency
objectstore-cli network latency-test \
  --target-nodes all

# Check bandwidth
objectstore-cli network bandwidth-test \
  --duration 60s

# Verify cluster connectivity
objectstore-cli cluster connectivity-test
```

## Integration Examples

### PACS Integration

**DICOM Storage:**

```python
import pydicom
import boto3

def store_dicom_study(dicom_files, patient_id, study_id):
    """Store DICOM study in Object Store"""
    
    client = boto3.client('s3', endpoint_url='https://objectstore.hospital.com')
    
    for dicom_file in dicom_files:
        # Read DICOM metadata
        ds = pydicom.dcmread(dicom_file)
        
        # Generate object key
        key = f"studies/{patient_id}/{study_id}/{ds.SOPInstanceUID}.dcm"
        
        # Upload with metadata
        with open(dicom_file, 'rb') as f:
            client.put_object(
                Bucket='dicom-studies',
                Key=key,
                Body=f,
                Metadata={
                    'patient-id': patient_id,
                    'study-id': study_id,
                    'modality': str(ds.Modality),
                    'study-date': str(ds.StudyDate),
                    'series-id': str(ds.SeriesInstanceUID)
                },
                ContentType='application/dicom'
            )
```

### Backup Integration

**Automated Backup:**

```bash
#!/bin/bash
# Backup script for Object Store

DATE=$(date +%Y%m%d)
BACKUP_BUCKET="backup-$(date +%Y-%m)"

# Create backup bucket
objectstore-cli bucket create "$BACKUP_BUCKET" \
  --storage-class cold \
  --region backup-region

# Sync data to backup
objectstore-cli object sync \
  --source "s3://healthcare-images/" \
  --destination "s3://$BACKUP_BUCKET/healthcare-images/" \
  --recursive \
  --verify-checksums

# Generate backup report
objectstore-cli analytics backup-report \
  --source-bucket healthcare-images \
  --backup-bucket "$BACKUP_BUCKET" \
  --date "$DATE"
```

---

**Related Documentation:**

- [Getting Started Guide](getting-started.md)
- [API Reference](api-reference.md)
- [Administrator Guide](admin-guide.md)
