# PACS Administrator Guide

Comprehensive administration guide for managing the Novarad PACS system.

## Table of Contents

- [System Architecture](#system-architecture)
- [Installation and Setup](#installation-and-setup)
- [User Management](#user-management)
- [DICOM Configuration](#dicom-configuration)
- [Storage Management](#storage-management)
- [Security and Compliance](#security-and-compliance)
- [Performance Monitoring](#performance-monitoring)
- [Backup and Recovery](#backup-and-recovery)
- [Maintenance and Updates](#maintenance-and-updates)

## System Architecture

### Component Overview

The PACS system consists of several key components:

**Core Services:**

- **DICOM Server**: Handles image storage and retrieval
- **Web Server**: Provides browser-based access
- **Database Server**: Manages study metadata and user information
- **Archive Server**: Long-term storage management
- **Gateway Services**: HL7 and RIS integration

**Client Components:**

- **Web Viewer**: Browser-based image viewing
- **Thick Client**: Native application for advanced features
- **Mobile Apps**: Tablet and smartphone access
- **DICOM Workstations**: Modality connections

### Network Requirements

**Bandwidth Requirements:**

- **LAN**: Gigabit Ethernet minimum
- **WAN**: 100 Mbps for remote sites
- **Internet**: 50 Mbps for cloud components
- **Redundancy**: Dual network paths recommended

**Port Configuration:**

- **DICOM**: Port 104 (configurable)
- **Web Interface**: Ports 80/443
- **Database**: Port 5432 (PostgreSQL)
- **HL7**: Port 6661 (configurable)

## Installation and Setup

### Pre-Installation Checklist

Before installing PACS, verify:

1. **Hardware Requirements Met**
2. **Network Configuration Complete**
3. **Database Server Prepared**
4. **Security Certificates Obtained**
5. **License Keys Available**

### Server Installation

### Step 1: Database Setup

```sql
-- Create PACS database
CREATE DATABASE pacs_db;
CREATE USER pacs_user WITH PASSWORD '<your_secure_password>';
GRANT ALL PRIVILEGES ON DATABASE pacs_db TO pacs_user;
```

### Step 2: Core Services Installation

```bash
# Install PACS server components
sudo ./install-pacs-server.sh

# Configure database connection
sudo nano /etc/pacs/database.conf

# Start services
sudo systemctl enable pacs-server
sudo systemctl start pacs-server
```

### Step 3: Web Server Configuration

```bash
# Configure HTTPS
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/pacs.key \
    -out /etc/ssl/certs/pacs.crt

# Update web server configuration
sudo nano /etc/pacs/web-server.conf
```

### Client Deployment

**Browser Requirements:**

- Chrome 90+ (Recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

**Thick Client Installation:**

```bash
# Windows
NovaradPACS-Client.msi /quiet

# macOS
sudo installer -pkg NovaradPACS-Client.pkg -target /

# Linux
sudo dpkg -i novarad-pacs-client.deb
```

## User Management

### User Roles and Permissions

**Administrator:**

- Full system access
- User management
- System configuration
- Performance monitoring

**Radiologist:**

- Image viewing and reporting
- Study assignment
- Measurement tools
- Report generation

**Technologist:**

- Study uploading
- Quality control
- Patient scheduling
- Basic measurements

**Referring Physician:**

- View assigned studies
- Access reports
- Limited measurement tools
- Print capabilities

### Creating User Accounts

**Through Web Interface:**

1. Access Admin Panel → User Management
2. Click "Add New User"
3. Enter user details and assign role
4. Set password and security preferences
5. Configure study access permissions

**Through Command Line:**

```bash
# Add new user
sudo pacs-admin add-user \
    --username "jdoe" \
    --fullname "John Doe" \
    --email "jdoe@hospital.com" \
    --role "radiologist"

# Set password
sudo pacs-admin set-password --username "jdoe"
```

### Group Management

**Creating User Groups:**

```bash
# Create department group
sudo pacs-admin create-group \
    --name "Cardiology" \
    --description "Cardiovascular Imaging Department"

# Add users to group
sudo pacs-admin add-user-to-group \
    --username "jdoe" \
    --group "Cardiology"
```

## DICOM Configuration

### DICOM Node Setup

**Adding Modalities:**

1. Access DICOM Configuration → Nodes
2. Add modality information:
   - AE Title
   - IP Address
   - Port Number
   - Compression Settings

**Example Configuration:**

```yaml
modalities:
  - name: "CT_SCANNER_1"
    ae_title: "CT1"
    host: "192.168.1.100"
    port: 104
    compression: "JPEG_LOSSY"
    
  - name: "MRI_SCANNER_1"
    ae_title: "MRI1"
    host: "192.168.1.101"
    port: 104
    compression: "JPEG_LOSSLESS"
```

### Auto-Routing Rules

**Setting Up Automatic Forwarding:**

```yaml
routing_rules:
  - condition: "modality == 'CT'"
    action: "forward"
    destination: "BACKUP_PACS"
    
  - condition: "study_description contains 'CARDIAC'"
    action: "notify"
    recipient: "cardiology_group"
```

### Quality Control

**Automated QC Checks:**

- **Image Completeness**: Verify all images received
- **Metadata Validation**: Check required DICOM tags
- **Duplicate Detection**: Identify duplicate studies
- **Compression Verification**: Ensure proper compression

## Storage Management

### Storage Tiers

**Online Storage (Tier 1):**

- Recent studies (last 30 days)
- Frequently accessed studies
- Emergency/Stat studies
- High-performance SSD storage

**Near-line Storage (Tier 2):**

- Studies 30 days to 2 years old
- Moderate access frequency
- Standard enterprise drives
- Automated retrieval

**Archive Storage (Tier 3):**

- Studies older than 2 years
- Infrequent access
- Tape or cloud storage
- Manual retrieval process

### Storage Policies

**Retention Policies:**

```yaml
retention_rules:
  - study_age: "0-30_days"
    tier: "online"
    copies: 2
    
  - study_age: "30_days-2_years"
    tier: "nearline"
    copies: 1
    
  - study_age: "2_years+"
    tier: "archive"
    copies: 1
    backup_location: "offsite"
```

### Disk Space Management

**Monitoring Commands:**

```bash
# Check storage usage
sudo pacs-admin storage-status

# View by modality
sudo pacs-admin storage-usage --by-modality

# Cleanup old cache files
sudo pacs-admin cleanup --older-than 30d
```

## Security and Compliance

### HIPAA Compliance

**Required Configurations:**

1. **Access Controls**: Role-based permissions
2. **Audit Logging**: All user activities logged
3. **Data Encryption**: TLS 1.3 for transmission
4. **Backup Encryption**: AES-256 for stored data
5. **Password Policies**: Strong password requirements

### Access Control

**Network Security:**

```bash
# Configure firewall rules
sudo ufw allow from 192.168.1.0/24 to any port 104
sudo ufw allow from 192.168.1.0/24 to any port 443
sudo ufw deny 104
sudo ufw deny 443
```

**SSL/TLS Configuration:**

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/ssl/certs/pacs.crt;
    ssl_certificate_key /etc/ssl/private/pacs.key;
    ssl_protocols TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
}
```

### Audit Logging

**Log Categories:**

- **User Authentication**: Login/logout events
- **Study Access**: Image viewing and downloads
- **Administrative Actions**: Configuration changes
- **System Events**: Service starts/stops, errors

**Log Analysis:**

```bash
# View recent access logs
sudo tail -f /var/log/pacs/access.log

# Search for specific user activity
sudo grep "username:jdoe" /var/log/pacs/access.log

# Generate compliance report
sudo pacs-admin audit-report --start-date 2024-01-01 --end-date 2024-01-31
```

## Performance Monitoring

### Key Metrics

**System Performance:**

- **CPU Utilization**: Target <80% average
- **Memory Usage**: Target <85% utilization
- **Disk I/O**: Monitor queue length and latency
- **Network Throughput**: Track bandwidth usage

**Application Metrics:**

- **Study Retrieval Time**: Target <5 seconds
- **Image Load Time**: Target <2 seconds per image
- **Concurrent Users**: Monitor system capacity
- **Database Performance**: Query response times

### Monitoring Tools

**Built-in Monitoring:**

```bash
# System status dashboard
sudo pacs-admin status

# Performance metrics
sudo pacs-admin metrics --last 24h

# Generate performance report
sudo pacs-admin performance-report --date 2024-01-15
```

**Integration with External Tools:**

- **Prometheus**: Metrics collection
- **Grafana**: Visualization dashboards
- **Nagios**: Alert management
- **ELK Stack**: Log analysis

## Backup and Recovery

### Backup Strategy

**Three-Tier Backup Approach:**

1. **Local Backup**: Daily incremental backups
2. **Offsite Backup**: Weekly full backups
3. **Cloud Backup**: Monthly archive backups

**Backup Components:**

- **Database**: Patient/study metadata
- **Images**: DICOM image files
- **Configuration**: System settings and preferences
- **Logs**: Audit and system logs

### Backup Implementation

**Database Backup:**

```bash
# Daily database backup
pg_dump pacs_db | gzip > /backup/pacs_db_$(date +%Y%m%d).sql.gz

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backup/daily"
DATE=$(date +%Y%m%d_%H%M)
pg_dump pacs_db | gzip > "$BACKUP_DIR/pacs_db_$DATE.sql.gz"
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +7 -delete
```

**Image Archive Backup:**

```bash
# Sync images to backup location
rsync -av --progress /data/pacs/images/ /backup/images/

# Cloud backup (using AWS CLI)
aws s3 sync /data/pacs/images/ s3://pacs-backup-bucket/images/
```

### Disaster Recovery

**Recovery Procedures:**

1. **System Assessment**: Evaluate damage and data loss
2. **Infrastructure Recovery**: Restore servers and network
3. **Database Restoration**: Recover metadata and indexes
4. **Image Recovery**: Restore medical images
5. **System Validation**: Verify functionality and data integrity

**Recovery Testing:**

```bash
# Test database recovery
pg_restore -d pacs_db_test /backup/pacs_db_latest.sql.gz

# Verify image integrity
sudo pacs-admin verify-images --sample-size 1000
```

## Maintenance and Updates

### Regular Maintenance Tasks

**Daily:**

- Monitor system performance
- Check error logs
- Verify backup completion
- Review security alerts

**Weekly:**

- Update virus definitions
- Clean temporary files
- Check disk space usage
- Review user access logs

**Monthly:**

- Apply security patches
- Update documentation
- Review storage policies
- Conduct backup testing

### Software Updates

**Update Process:**

1. **Test Environment**: Deploy updates to test system
2. **Validation**: Verify functionality and performance
3. **Maintenance Window**: Schedule production update
4. **Backup**: Create full system backup
5. **Update Deployment**: Apply updates to production
6. **Verification**: Confirm successful update

**Update Commands:**

```bash
# Check for available updates
sudo pacs-admin check-updates

# Download updates
sudo pacs-admin download-updates

# Apply updates (during maintenance window)
sudo pacs-admin apply-updates

# Rollback if needed
sudo pacs-admin rollback --to-version 2.1.0
```

### Performance Optimization

**Database Optimization:**

```sql
-- Reindex database tables
REINDEX DATABASE pacs_db;

-- Update table statistics
ANALYZE;

-- Clean up old log entries
DELETE FROM audit_log WHERE created_date < NOW() - INTERVAL '1 year';
```

**Storage Optimization:**

```bash
# Compress old studies
sudo pacs-admin compress-studies --older-than 1y

# Defragment storage
sudo pacs-admin defrag-storage

# Update storage policies
sudo pacs-admin update-storage-policies
```

## Troubleshooting

### Common Issues

**Service Won't Start:**

```bash
# Check service status
sudo systemctl status pacs-server

# View detailed logs
sudo journalctl -u pacs-server -f

# Restart services
sudo systemctl restart pacs-server
```

**Database Connection Issues:**

```bash
# Test database connection
sudo -u pacs psql -h localhost -d pacs_db -c "SELECT version();"

# Check database permissions
sudo -u postgres psql -c "\du"
```

**Performance Issues:**

```bash
# Check system resources
top
df -h
iostat -x 1

# Analyze slow queries
sudo pacs-admin slow-query-log --last 1h
```

## Emergency Procedures

### System Failure Response

**Immediate Actions:**

1. **Assess Impact**: Determine scope of failure
2. **Notify Stakeholders**: Alert clinical staff
3. **Activate Backup Systems**: Switch to redundant systems
4. **Document Issues**: Record all actions taken
5. **Begin Recovery**: Follow disaster recovery plan

**Contact Information:**

- **Technical Support**: Available 24/7
- **Vendor Support**: Escalation procedures
- **Management**: Notification requirements
- **Clinical Staff**: Communication protocols

---

**Related Documentation:**

- [Getting Started Guide](getting-started.md)
- [User Manual](user-manual.md)
- [Troubleshooting Guide](troubleshooting.md)
