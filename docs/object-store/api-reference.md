# Object Store API Reference

Comprehensive API documentation for the Novarad Object Store.

## Table of Contents

- [Authentication](#authentication)
- [REST API Overview](#rest-api-overview)
- [Bucket Operations](#bucket-operations)
- [Object Operations](#object-operations)
- [User Management](#user-management)
- [Access Control](#access-control)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Error Handling](#error-handling)
- [SDK Examples](#sdk-examples)

## Authentication

### API Key Authentication

### Request Headers

```http
Authorization: Bearer your-api-key
Content-Type: application/json
```

### Generating API Keys

```bash
# Create API key for user
curl -X POST \
  -H "Authorization: Bearer admin-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "permissions": ["read", "write"],
    "expires_at": "2025-12-31T23:59:59Z"
  }' \
  https://objectstore.hospital.com/api/v1/auth/api-keys
```

### Response

```json
{
  "api_key": "os_ak_1234567890abcdef",
  "secret_key": "PLACEHOLDER_SECRET_KEY",
  "user_id": "user123",
  "created_at": "2024-01-15T10:30:00Z",
  "expires_at": "2025-12-31T23:59:59Z",
  "permissions": ["read", "write"]
}
```

### OAuth 2.0 Authentication

### Authorization Code Flow

```http
GET /api/v1/oauth/authorize?
  response_type=code&
  client_id=your-client-id&
  redirect_uri=https://your-app.com/callback&
  scope=read+write&
  state=random-state-string
```

### Token Exchange

```http
POST /api/v1/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=auth-code-from-callback&
client_id=your-client-id&
client_secret=PLACEHOLDER_CLIENT_SECRET&
redirect_uri=https://your-app.com/callback
```

## REST API Overview

### Base URL

```text
https://objectstore.hospital.com/api/v1
```

### Common Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "metadata": {
    "request_id": "req_1234567890",
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "BUCKET_NOT_FOUND",
    "message": "The specified bucket does not exist",
    "details": {
      "bucket_name": "nonexistent-bucket"
    }
  },
  "metadata": {
    "request_id": "req_1234567890",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Rate Limiting

### Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642248000
```

## Bucket Operations

### List Buckets

### Request

```http
GET /api/v1/buckets
Authorization: Bearer your-api-key
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `region` | string | Filter by region |
| `storage_class` | string | Filter by storage class |
| `limit` | integer | Maximum number of results (1-1000) |
| `offset` | integer | Pagination offset |

### Response

```json
{
  "success": true,
  "data": {
    "buckets": [
      {
        "name": "healthcare-images",
        "region": "us-east-1",
        "storage_class": "hot",
        "created_at": "2024-01-01T00:00:00Z",
        "size_bytes": 1073741824,
        "object_count": 1500,
        "versioning": "enabled",
        "encryption": "aes256"
      }
    ],
    "total_count": 1,
    "has_more": false
  }
}
```

### Create Bucket

### Request

```http
POST /api/v1/buckets
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "name": "new-bucket",
  "region": "us-east-1",
  "storage_class": "hot",
  "versioning": "enabled",
  "encryption": {
    "algorithm": "aes256",
    "key_management": "managed"
  },
  "lifecycle_rules": [
    {
      "id": "transition-to-cold",
      "status": "enabled",
      "transitions": [
        {
          "days": 30,
          "storage_class": "cold"
        }
      ]
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "data": {
    "bucket": {
      "name": "new-bucket",
      "region": "us-east-1",
      "storage_class": "hot",
      "created_at": "2024-01-15T10:30:00Z",
      "arn": "arn:objectstore:s3:::new-bucket"
    }
  }
}
```

### Get Bucket Details

### Request

```http
GET /api/v1/buckets/{bucket_name}
Authorization: Bearer your-api-key
```

### Response

```json
{
  "success": true,
  "data": {
    "bucket": {
      "name": "healthcare-images",
      "region": "us-east-1",
      "storage_class": "hot",
      "created_at": "2024-01-01T00:00:00Z",
      "size_bytes": 1073741824,
      "object_count": 1500,
      "versioning": "enabled",
      "encryption": {
        "algorithm": "aes256",
        "key_management": "managed"
      },
      "lifecycle_rules": [
        {
          "id": "healthcare-lifecycle",
          "status": "enabled",
          "filter": {
            "prefix": "studies/"
          },
          "transitions": [
            {
              "days": 30,
              "storage_class": "warm"
            },
            {
              "days": 365,
              "storage_class": "cold"
            }
          ]
        }
      ],
      "access_policy": {
        "version": "2023-01-01",
        "statements": [
          {
            "effect": "Allow",
            "principal": {
              "group": ["radiologists"]
            },
            "action": ["s3:GetObject", "s3:PutObject"],
            "resource": "arn:objectstore:s3:::healthcare-images/*"
          }
        ]
      }
    }
  }
}
```

### Delete Bucket

### Request

```http
DELETE /api/v1/buckets/{bucket_name}
Authorization: Bearer your-api-key
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `force` | boolean | Delete bucket even if not empty |

### Response

```json
{
  "success": true,
  "data": {
    "message": "Bucket deleted successfully",
    "deleted_at": "2024-01-15T10:30:00Z"
  }
}
```

## Object Operations

### List Objects

### Request

```http
GET /api/v1/buckets/{bucket_name}/objects
Authorization: Bearer your-api-key
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `prefix` | string | Object key prefix filter |
| `delimiter` | string | Delimiter for hierarchical listing |
| `limit` | integer | Maximum number of results (1-1000) |
| `marker` | string | Pagination marker |
| `metadata_filter` | object | Filter by metadata attributes |

### Response

```json
{
  "success": true,
  "data": {
    "objects": [
      {
        "key": "studies/ct/2024/patient-123/study-001.dcm",
        "size_bytes": 10485760,
        "storage_class": "hot",
        "last_modified": "2024-01-15T10:00:00Z",
        "etag": "9bb58f26192e4ba00f01e2e7b136bbd8",
        "version_id": "v1.0",
        "metadata": {
          "patient-id": "123",
          "study-type": "CT",
          "department": "radiology"
        },
        "content_type": "application/dicom"
      }
    ],
    "common_prefixes": [
      "studies/ct/2024/patient-124/",
      "studies/ct/2024/patient-125/"
    ],
    "total_count": 1500,
    "is_truncated": true,
    "next_marker": "studies/ct/2024/patient-123/study-002.dcm"
  }
}
```

### Upload Object

### Request

```http
PUT /api/v1/buckets/{bucket_name}/objects/{object_key}
Authorization: Bearer your-api-key
Content-Type: application/dicom
Content-Length: 10485760
X-Object-Metadata-Patient-Id: 123
X-Object-Metadata-Study-Type: CT

[Binary object data]
```

### Additional Headers

| Header | Description |
|--------|-------------|
| `X-Object-Storage-Class` | Storage class for the object |
| `X-Object-Metadata-*` | Custom metadata (prefix with X-Object-Metadata-) |
| `X-Object-Expires` | Object expiration date (ISO 8601) |
| `Content-MD5` | MD5 checksum for integrity verification |

### Response

```json
{
  "success": true,
  "data": {
    "object": {
      "key": "studies/ct/2024/patient-123/study-001.dcm",
      "bucket": "healthcare-images",
      "size_bytes": 10485760,
      "etag": "9bb58f26192e4ba00f01e2e7b136bbd8",
      "version_id": "v1.0",
      "storage_class": "hot",
      "uploaded_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Download Object

### Request

```http
GET /api/v1/buckets/{bucket_name}/objects/{object_key}
Authorization: Bearer your-api-key
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `version_id` | string | Specific version to retrieve |
| `response_content_disposition` | string | Content-Disposition header value |
| `response_content_type` | string | Content-Type header value |

### Response Headers

```http
HTTP/1.1 200 OK
Content-Type: application/dicom
Content-Length: 10485760
ETag: "9bb58f26192e4ba00f01e2e7b136bbd8"
Last-Modified: Mon, 15 Jan 2024 10:00:00 GMT
X-Object-Version-Id: v1.0
X-Object-Storage-Class: hot
X-Object-Metadata-Patient-Id: 123
X-Object-Metadata-Study-Type: CT

[Binary object data]
```

### Get Object Metadata

### Request

```http
HEAD /api/v1/buckets/{bucket_name}/objects/{object_key}
Authorization: Bearer your-api-key
```

### Response Headers

```http
HTTP/1.1 200 OK
Content-Type: application/dicom
Content-Length: 10485760
ETag: "9bb58f26192e4ba00f01e2e7b136bbd8"
Last-Modified: Mon, 15 Jan 2024 10:00:00 GMT
X-Object-Version-Id: v1.0
X-Object-Storage-Class: hot
X-Object-Metadata-Patient-Id: 123
X-Object-Metadata-Study-Type: CT
```

### Update Object Metadata

### Request

```http
POST /api/v1/buckets/{bucket_name}/objects/{object_key}/metadata
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "metadata": {
    "patient-id": "123",
    "study-type": "CT",
    "department": "radiology",
    "reviewed": "true",
    "reviewer": "dr-smith"
  },
  "storage_class": "warm"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "object": {
      "key": "studies/ct/2024/patient-123/study-001.dcm",
      "bucket": "healthcare-images",
      "metadata": {
        "patient-id": "123",
        "study-type": "CT",
        "department": "radiology",
        "reviewed": "true",
        "reviewer": "dr-smith"
      },
      "storage_class": "warm",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Delete Object

### Request

```http
DELETE /api/v1/buckets/{bucket_name}/objects/{object_key}
Authorization: Bearer your-api-key
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `version_id` | string | Specific version to delete |

### Response

```json
{
  "success": true,
  "data": {
    "message": "Object deleted successfully",
    "deleted_at": "2024-01-15T10:30:00Z",
    "version_id": "v1.0"
  }
}
```

### Multipart Upload

### Initiate Multipart Upload

```http
POST /api/v1/buckets/{bucket_name}/objects/{object_key}/multipart
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "content_type": "application/dicom",
  "metadata": {
    "patient-id": "123",
    "study-type": "MRI"
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "upload_id": "upload_abc123def456",
    "bucket": "healthcare-images",
    "key": "studies/mri/large-study.zip"
  }
}
```

### Upload Part

```http
PUT /api/v1/buckets/{bucket_name}/objects/{object_key}/multipart/{upload_id}/parts/{part_number}
Authorization: Bearer your-api-key
Content-Length: 104857600

[Binary part data]
```

### Complete Multipart Upload

```http
POST /api/v1/buckets/{bucket_name}/objects/{object_key}/multipart/{upload_id}/complete
Authorization: Bearer your-api-key
Content-Type: application/json

{
  "parts": [
    {
      "part_number": 1,
      "etag": "etag1"
    },
    {
      "part_number": 2,
      "etag": "etag2"
    }
  ]
}
```

## User Management

### List Users

### Request

```http
GET /api/v1/users
Authorization: Bearer admin-api-key
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `group` | string | Filter by user group |
| `status` | string | Filter by user status (active, inactive) |
| `limit` | integer | Maximum number of results |
| `offset` | integer | Pagination offset |

### Response

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user123",
        "username": "jsmith",
        "full_name": "Dr. John Smith",
        "email": "jsmith@hospital.com",
        "status": "active",
        "groups": ["radiologists", "department-radiology"],
        "created_at": "2024-01-01T00:00:00Z",
        "last_login": "2024-01-15T09:00:00Z",
        "permissions": [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
      }
    ],
    "total_count": 150,
    "has_more": true
  }
}
```

### Create User

### Request

```http
POST /api/v1/users
Authorization: Bearer admin-api-key
Content-Type: application/json

{
  "username": "new-user",
  "full_name": "Dr. Jane Doe",
  "email": "jdoe@hospital.com",
  "password": "PLACEHOLDER_PASSWORD",
  "groups": ["radiologists"],
  "permissions": [
    "s3:GetObject",
    "s3:ListBucket"
  ],
  "metadata": {
    "department": "radiology",
    "employee_id": "EMP123",
    "license_number": "MD12345"
  }
}
```

### Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user456",
      "username": "new-user",
      "full_name": "Dr. Jane Doe",
      "email": "jdoe@hospital.com",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Update User

### Request

```http
PUT /api/v1/users/{user_id}
Authorization: Bearer admin-api-key
Content-Type: application/json

{
  "full_name": "Dr. Jane Smith",
  "email": "jsmith@hospital.com",
  "groups": ["radiologists", "senior-staff"],
  "status": "active"
}
```

### Delete User

### Request

```http
DELETE /api/v1/users/{user_id}
Authorization: Bearer admin-api-key
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `transfer_ownership` | string | User ID to transfer object ownership |

## Access Control

### List Policies

### Request

```http
GET /api/v1/policies
Authorization: Bearer admin-api-key
```

### Response

```json
{
  "success": true,
  "data": {
    "policies": [
      {
        "id": "policy123",
        "name": "radiologist-access",
        "description": "Standard radiologist access policy",
        "version": "2023-01-01",
        "statements": [
          {
            "effect": "Allow",
            "actions": [
              "s3:GetObject",
              "s3:PutObject",
              "s3:ListBucket"
            ],
            "resources": [
              "arn:objectstore:s3:::healthcare-images/*"
            ],
            "conditions": {
              "StringEquals": {
                "objectstore:x-amz-metadata-department": "radiology"
              }
            }
          }
        ],
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-10T15:30:00Z"
      }
    ]
  }
}
```

### Create Policy

### Request

```http
POST /api/v1/policies
Authorization: Bearer admin-api-key
Content-Type: application/json

{
  "name": "research-access",
  "description": "Research data access policy",
  "version": "2023-01-01",
  "statements": [
    {
      "effect": "Allow",
      "actions": [
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "resources": [
        "arn:objectstore:s3:::research-data/*"
      ],
      "conditions": {
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

## Monitoring and Analytics

### System Health

### Request

```http
GET /api/v1/system/health
Authorization: Bearer admin-api-key
```

### Response

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "3.0.1",
    "uptime_seconds": 2592000,
    "cluster": {
      "total_nodes": 5,
      "healthy_nodes": 5,
      "unhealthy_nodes": 0
    },
    "storage": {
      "total_capacity_bytes": 10995116277760,
      "used_capacity_bytes": 5497558138880,
      "available_capacity_bytes": 5497558138880,
      "utilization_percentage": 50.0
    },
    "performance": {
      "requests_per_second": 1500,
      "average_latency_ms": 25,
      "error_rate_percentage": 0.01
    },
    "services": {
      "api_server": "healthy",
      "metadata_service": "healthy",
      "storage_service": "healthy",
      "replication_service": "healthy"
    }
  }
}
```

### Usage Analytics

### Request

```http
GET /api/v1/analytics/usage
Authorization: Bearer admin-api-key
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `start_date` | string | Start date (ISO 8601) |
| `end_date` | string | End date (ISO 8601) |
| `bucket` | string | Filter by bucket |
| `user` | string | Filter by user |
| `group_by` | string | Group by: hour, day, week, month |

### Response

```json
{
  "success": true,
  "data": {
    "usage": {
      "period": {
        "start": "2024-01-01T00:00:00Z",
        "end": "2024-01-31T23:59:59Z"
      },
      "requests": {
        "total": 1500000,
        "get_requests": 900000,
        "put_requests": 400000,
        "delete_requests": 50000,
        "list_requests": 150000
      },
      "data_transfer": {
        "bytes_downloaded": 5497558138880,
        "bytes_uploaded": 2748779069440,
        "bandwidth_utilization_mbps": 850
      },
      "storage": {
        "total_objects": 150000,
        "total_size_bytes": 10995116277760,
        "by_storage_class": {
          "hot": {
            "objects": 50000,
            "size_bytes": 5497558138880
          },
          "warm": {
            "objects": 75000,
            "size_bytes": 4123168604160
          },
          "cold": {
            "objects": 25000,
            "size_bytes": 1374389534720
          }
        }
      },
      "users": {
        "active_users": 150,
        "top_users": [
          {
            "username": "jsmith",
            "requests": 50000,
            "data_transfer_bytes": 274877906944
          }
        ]
      }
    }
  }
}
```

## Error Handling

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

### Error Codes

| Error Code | Description |
|------------|-------------|
| `INVALID_REQUEST` | Malformed request |
| `AUTHENTICATION_FAILED` | Invalid credentials |
| `AUTHORIZATION_FAILED` | Insufficient permissions |
| `BUCKET_NOT_FOUND` | Bucket does not exist |
| `BUCKET_ALREADY_EXISTS` | Bucket name already taken |
| `OBJECT_NOT_FOUND` | Object does not exist |
| `QUOTA_EXCEEDED` | Storage quota exceeded |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "BUCKET_NOT_FOUND",
    "message": "The specified bucket does not exist",
    "details": {
      "bucket_name": "nonexistent-bucket",
      "available_buckets": ["healthcare-images", "backup-data"]
    },
    "retry_after": null
  },
  "metadata": {
    "request_id": "req_1234567890",
    "timestamp": "2024-01-15T10:30:00Z",
    "support_reference": "SR-2024-0115-001"
  }
}
```

## SDK Examples

### Python SDK

### Installation

```bash
pip install novarad-objectstore-sdk
```

### Basic Usage

```python
from novarad_objectstore import Client, Config

# Initialize client
config = Config(
    endpoint='https://objectstore.hospital.com',
    access_key='your-access-key',
    secret_key='PLACEHOLDER_SECRET_KEY',
    region='us-east-1'
)

client = Client(config)

# Upload object
with open('study.dcm', 'rb') as f:
    result = client.put_object(
        bucket='healthcare-images',
        key='studies/ct/study-001.dcm',
        data=f,
        metadata={
            'patient-id': '123',
            'study-type': 'CT'
        }
    )

# Download object
with open('downloaded-study.dcm', 'wb') as f:
    client.get_object(
        bucket='healthcare-images',
        key='studies/ct/study-001.dcm',
        file=f
    )

# List objects
objects = client.list_objects(
    bucket='healthcare-images',
    prefix='studies/ct/',
    metadata_filter={'study-type': 'CT'}
)

for obj in objects:
    print(f"Key: {obj.key}, Size: {obj.size}, Modified: {obj.last_modified}")
```

### JavaScript SDK

### Installation

```bash
npm install @novarad/objectstore-sdk
```

### Basic Usage

```javascript
const { ObjectStoreClient } = require('@novarad/objectstore-sdk');

// Initialize client
const client = new ObjectStoreClient({
  endpoint: 'https://objectstore.hospital.com',
  accessKey: 'your-access-key',
  secretKey: 'PLACEHOLDER_SECRET_KEY',
  region: 'us-east-1'
});

// Upload object
const uploadResult = await client.putObject({
  bucket: 'healthcare-images',
  key: 'studies/ct/study-001.dcm',
  body: fileBuffer,
  metadata: {
    'patient-id': '123',
    'study-type': 'CT'
  }
});

// Download object
const downloadResult = await client.getObject({
  bucket: 'healthcare-images',
  key: 'studies/ct/study-001.dcm'
});

// List objects
const listResult = await client.listObjects({
  bucket: 'healthcare-images',
  prefix: 'studies/ct/',
  metadataFilter: { 'study-type': 'CT' }
});

listResult.objects.forEach(obj => {
  console.log(`Key: ${obj.key}, Size: ${obj.size}`);
});
```

### Java SDK

### Maven Dependency

```xml
<dependency>
  <groupId>com.novarad</groupId>
  <artifactId>objectstore-sdk</artifactId>
  <version>3.0.1</version>
</dependency>
```

### Basic Usage

```java
import com.novarad.objectstore.ObjectStoreClient;
import com.novarad.objectstore.ObjectStoreConfig;

// Initialize client
ObjectStoreConfig config = ObjectStoreConfig.builder()
    .endpoint("https://objectstore.hospital.com")
    .accessKey("your-access-key")
    .secretKey("PLACEHOLDER_SECRET_KEY")
    .region("us-east-1")
    .build();

ObjectStoreClient client = new ObjectStoreClient(config);

// Upload object
Map<String, String> metadata = new HashMap<>();
metadata.put("patient-id", "123");
metadata.put("study-type", "CT");

PutObjectResult result = client.putObject(PutObjectRequest.builder()
    .bucket("healthcare-images")
    .key("studies/ct/study-001.dcm")
    .body(inputStream)
    .metadata(metadata)
    .build());

// Download object
GetObjectResult getResult = client.getObject(GetObjectRequest.builder()
    .bucket("healthcare-images")
    .key("studies/ct/study-001.dcm")
    .build());

// List objects
ListObjectsResult listResult = client.listObjects(ListObjectsRequest.builder()
    .bucket("healthcare-images")
    .prefix("studies/ct/")
    .metadataFilter(Collections.singletonMap("study-type", "CT"))
    .build());
```

---

### Related Documentation

- [Getting Started Guide](getting-started.md)
- [User Manual](user-manual.md)
- [Administrator Guide](admin-guide.md)
