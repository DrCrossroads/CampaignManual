# RIS Administrator Guide

Comprehensive administration guide for managing the Novarad RIS system.

## Table of Contents

- [System Architecture](#system-architecture)
- [Installation and Configuration](#installation-and-configuration)
- [User Management](#user-management)
- [Interface Management](#interface-management)
- [Database Administration](#database-administration)
- [Security and Compliance](#security-and-compliance)
- [Performance Monitoring](#performance-monitoring)
- [Backup and Recovery](#backup-and-recovery)
- [Maintenance and Updates](#maintenance-and-updates)

## System Architecture

### Component Overview

The RIS system consists of several integrated components:

**Core Services:**

- **Application Server**: Web-based RIS application hosting
- **Database Server**: Patient and workflow data management
- **Interface Engine**: HL7 message processing and routing
- **Report Server**: Report generation and distribution
- **Scheduling Engine**: Appointment and resource management

**Integration Components:**

- **HL7 Interfaces**: EMR and system integration
- **PACS Connector**: Image system integration
- **DICOM Worklist**: Modality work scheduling
- **Billing Interface**: Financial system integration

### Network Architecture

**Server Requirements:**

- **Application Server**: Load-balanced web servers
- **Database Server**: High-availability database cluster
- **Interface Server**: Dedicated HL7 processing
- **File Server**: Document and template storage

**Security Zones:**

- **DMZ**: External interfaces and web services
- **Internal Network**: Core application servers
- **Database Network**: Secure database access
- **Management Network**: Administrative access

## Installation and Configuration

### Pre-Installation Requirements

**Hardware Specifications:**

- **CPU**: 8+ cores, 2.5GHz minimum
- **RAM**: 32GB minimum, 64GB recommended
- **Storage**: 1TB SSD for application, 10TB+ for database
- **Network**: Gigabit Ethernet with redundancy

**Software Prerequisites:**

- **Operating System**: Windows Server 2019+ or Linux RHEL 8+
- **Database**: PostgreSQL 13+ or SQL Server 2019+
- **Web Server**: IIS 10+ or Apache 2.4+
- **Runtime**: .NET 6+ or Java 11+

### Installation Process

**Database Setup:**

```sql
-- Create RIS database and users
CREATE DATABASE ris_production;

-- Create application user
CREATE LOGIN ris_app WITH PASSWORD = 'your-secure-password-here';
CREATE USER ris_app FOR LOGIN ris_app;

-- Grant necessary permissions
GRANT db_datareader, db_datawriter TO ris_app;
GRANT EXECUTE TO ris_app;

-- Create backup user
CREATE LOGIN ris_backup WITH PASSWORD = 'your-backup-password-here';
CREATE USER ris_backup FOR LOGIN ris_backup;
GRANT db_backupoperator TO ris_backup;
```

**Application Installation:**

```bash
# Extract installation files
tar -xzf novarad-ris-v3.0.tar.gz
cd novarad-ris-v3.0

# Run installation script
sudo ./install.sh --config-file ris-config.yaml

# Configure database connection
sudo nano /opt/novarad/ris/config/database.conf

# Start RIS services
sudo systemctl enable ris-app
sudo systemctl enable ris-interfaces
sudo systemctl start ris-app
sudo systemctl start ris-interfaces
```

**Initial Configuration:**

1. **Database Configuration**: Set connection strings and timeout values
2. **Security Settings**: Configure authentication and authorization
3. **Interface Setup**: Define HL7 endpoints and message routing
4. **User Roles**: Create initial administrative accounts
5. **System Preferences**: Set default workflow parameters

## User Management

### User Roles and Permissions

**System Administrator:**

- Complete system access and configuration
- User account management
- Interface configuration and monitoring
- System performance and maintenance

**Department Administrator:**

- Department-specific configuration
- User management within department
- Workflow customization
- Report configuration

**Radiologist:**

- Patient and study access
- Reporting and communication
- Quality assurance workflows
- Teaching and research functions

**Technologist:**

- Patient scheduling and check-in
- Order management and tracking
- Equipment and room management
- Quality control procedures

**Registrar/Scheduler:**

- Patient registration and demographics
- Appointment scheduling
- Insurance verification
- Patient communication

### Account Management

**Creating User Accounts:**

```bash
# Add new user via command line
sudo ris-admin create-user \
    --username "jsmith" \
    --fullname "John Smith" \
    --email "jsmith@hospital.com" \
    --role "radiologist" \
    --department "Radiology"

# Set password and force change on first login
sudo ris-admin set-password --username "jsmith" --force-change

# Assign additional permissions
sudo ris-admin assign-permission \
    --username "jsmith" \
    --permission "teaching_access"
```

**Bulk User Import:**

```bash
# Import users from CSV file
sudo ris-admin import-users --file users.csv --validate

# Template CSV format:
# username,fullname,email,role,department,phone,license_number
# jsmith,John Smith,jsmith@hospital.com,radiologist,Radiology,555-1234,MD12345
```

**User Deactivation:**

```bash
# Deactivate user account
sudo ris-admin deactivate-user --username "jsmith"

# Reassign pending work items
sudo ris-admin reassign-work --from "jsmith" --to "backup_radiologist"
```

## Interface Management

### HL7 Interface Configuration

**Interface Types:**

- **ADT (Patient Administration)**: Patient demographics and movements
- **ORM (Order Management)**: Imaging orders and modifications
- **ORU (Results)**: Report delivery and status updates
- **SIU (Scheduling)**: Appointment scheduling integration

**Configuration Example:**

```yaml
interfaces:
  emr_inbound:
    type: "hl7_tcp"
    port: 6661
    message_types: ["ADT", "ORM"]
    encoding: "ER7"
    processing:
      - validate_message
      - patient_matching
      - order_creation
    
  pacs_worklist:
    type: "dicom_worklist"
    ae_title: "RIS_WL"
    port: 104
    query_timeout: 30
    max_results: 100
```

**Interface Monitoring:**

```bash
# Check interface status
sudo ris-admin interface-status

# View message logs
sudo ris-admin interface-logs --interface emr_inbound --last 24h

# Test interface connectivity
sudo ris-admin test-interface --interface pacs_worklist
```

### DICOM Worklist Management

**Worklist Configuration:**

- **Query Parameters**: Define searchable fields
- **Security Settings**: Configure access controls
- **Performance Tuning**: Optimize query response times
- **Modality Integration**: Configure device-specific settings

**Worklist Monitoring:**

```bash
# Monitor worklist queries
sudo ris-admin worklist-stats --date today

# View active queries
sudo ris-admin active-queries

# Clear stale worklist entries
sudo ris-admin cleanup-worklist --older-than 7d
```

## Database Administration

### Database Maintenance

**Regular Maintenance Tasks:**

```sql
-- Update table statistics
UPDATE STATISTICS;

-- Rebuild fragmented indexes
ALTER INDEX ALL ON patient_table REBUILD;

-- Clean up old audit logs
DELETE FROM audit_log WHERE created_date < DATEADD(year, -7, GETDATE());

-- Verify database integrity
DBCC CHECKDB('ris_production');
```

**Performance Optimization:**

```sql
-- Monitor slow queries
SELECT TOP 10 
    total_elapsed_time/execution_count as avg_time,
    text,
    execution_count
FROM sys.dm_exec_query_stats 
CROSS APPLY sys.dm_exec_sql_text(sql_handle)
ORDER BY avg_time DESC;

-- Add missing indexes
CREATE INDEX IX_studies_date_modality 
ON studies (study_date, modality) 
INCLUDE (patient_id, accession_number);
```

### Data Archival

**Archival Strategy:**

- **Active Data**: Last 2 years online
- **Archived Data**: 2-7 years near-line storage
- **Historical Data**: 7+ years offline archive

**Archival Process:**

```bash
# Archive old studies
sudo ris-admin archive-data \
    --start-date "2020-01-01" \
    --end-date "2020-12-31" \
    --target-location "/archive/2020"

# Verify archived data
sudo ris-admin verify-archive --location "/archive/2020"

# Remove archived data from production
sudo ris-admin purge-archived --confirm
```

## Security and Compliance

### Access Control

**Authentication Methods:**

- **Local Authentication**: Username/password with complexity requirements
- **LDAP Integration**: Active Directory authentication
- **SAML SSO**: Single sign-on with identity providers
- **Multi-factor Authentication**: Enhanced security options

**Authorization Framework:**

```bash
# Create custom role
sudo ris-admin create-role \
    --name "research_access" \
    --description "Research data access"

# Assign permissions to role
sudo ris-admin assign-permission \
    --role "research_access" \
    --permission "anonymized_data_export"

# Apply role to user
sudo ris-admin assign-role \
    --username "researcher1" \
    --role "research_access"
```

### HIPAA Compliance

**Required Configurations:**

1. **Access Logging**: Complete audit trail of data access
2. **Data Encryption**: Encryption at rest and in transit
3. **User Training**: Security awareness and compliance training
4. **Incident Response**: Data breach notification procedures
5. **Business Associate Agreements**: Third-party compliance

**Audit Reporting:**

```bash
# Generate access audit report
sudo ris-admin audit-report \
    --type "data_access" \
    --start-date "2024-01-01" \
    --end-date "2024-01-31" \
    --format "pdf"

# User activity summary
sudo ris-admin user-activity \
    --username "jsmith" \
    --date-range "last_30_days"
```

## Performance Monitoring

### System Metrics

**Key Performance Indicators:**

- **Response Time**: Average page load times
- **Throughput**: Transactions per second
- **Availability**: System uptime percentage
- **Resource Utilization**: CPU, memory, and disk usage

**Monitoring Tools:**

```bash
# Real-time system status
sudo ris-admin system-status

# Performance metrics dashboard
sudo ris-admin metrics-dashboard

# Generate performance report
sudo ris-admin performance-report --period weekly
```

### Database Performance

**Query Performance:**

```sql
-- Identify slow running queries
SELECT 
    query_hash,
    total_elapsed_time/execution_count as avg_duration,
    execution_count,
    total_logical_reads/execution_count as avg_logical_reads
FROM sys.dm_exec_query_stats
WHERE total_elapsed_time/execution_count > 1000000 -- 1 second
ORDER BY avg_duration DESC;
```

**Connection Monitoring:**

```sql
-- Monitor active connections
SELECT 
    session_id,
    login_name,
    host_name,
    program_name,
    status,
    last_request_start_time
FROM sys.dm_exec_sessions
WHERE is_user_process = 1;
```

## Backup and Recovery

### Backup Strategy

**Backup Components:**

- **Database**: Full, differential, and transaction log backups
- **Application Files**: Configuration and customization files
- **Interface Logs**: HL7 message logs and audit trails
- **Reports**: Generated reports and templates

**Automated Backup Script:**

```bash
#!/bin/bash
# RIS Backup Script

DATE=$(date +"%Y%m%d_%H%M")
BACKUP_DIR="/backup/ris"

# Database backup
pg_dump ris_production | gzip > "$BACKUP_DIR/db_backup_$DATE.sql.gz"

# Configuration backup
tar -czf "$BACKUP_DIR/config_backup_$DATE.tar.gz" /opt/novarad/ris/config

# Clean old backups (keep 30 days)
find "$BACKUP_DIR" -name "*.gz" -mtime +30 -delete

# Verify backup integrity
gunzip -t "$BACKUP_DIR/db_backup_$DATE.sql.gz"
```

### Disaster Recovery

**Recovery Procedures:**

1. **Assessment**: Evaluate system damage and data loss
2. **Infrastructure**: Restore servers and network connectivity
3. **Database Recovery**: Restore from latest backup
4. **Application Deployment**: Reinstall and configure RIS
5. **Interface Restoration**: Reconnect all system interfaces
6. **Validation**: Verify system functionality and data integrity

**Recovery Testing:**

```bash
# Test database recovery
pg_restore -d ris_test /backup/ris/db_backup_latest.sql.gz

# Validate data integrity
sudo ris-admin validate-data --database ris_test

# Test interface connectivity
sudo ris-admin test-all-interfaces --environment test
```

## Maintenance and Updates

### Regular Maintenance

**Daily Tasks:**

- Monitor interface message processing
- Check system error logs
- Verify backup completion
- Review security alerts

**Weekly Tasks:**

- Update user access reviews
- Analyze system performance metrics
- Clean temporary files and logs
- Test disaster recovery procedures

**Monthly Tasks:**

- Apply security patches
- Review and update documentation
- Conduct user training sessions
- Analyze system usage patterns

### Software Updates

**Update Process:**

1. **Planning**: Review update notes and impact assessment
2. **Testing**: Deploy updates to test environment
3. **Validation**: Verify functionality and performance
4. **Scheduling**: Plan maintenance window
5. **Backup**: Create full system backup
6. **Deployment**: Apply updates to production
7. **Verification**: Confirm successful update

**Update Commands:**

```bash
# Check for available updates
sudo ris-admin check-updates

# Download updates to staging
sudo ris-admin download-updates --environment staging

# Apply updates (during maintenance window)
sudo ris-admin apply-updates --confirm

# Rollback if issues occur
sudo ris-admin rollback --to-version "3.0.1"
```

## Troubleshooting

### Common Issues

**Service Startup Problems:**

```bash
# Check service status
sudo systemctl status ris-app
sudo systemctl status ris-interfaces

# View service logs
sudo journalctl -u ris-app -f
sudo journalctl -u ris-interfaces -f

# Restart services
sudo systemctl restart ris-app
sudo systemctl restart ris-interfaces
```

**Database Connection Issues:**

```bash
# Test database connectivity
sudo ris-admin test-database

# Check connection pool status
sudo ris-admin connection-pool-status

# Reset connection pool
sudo ris-admin reset-connections
```

**Interface Problems:**

```bash
# Check interface status
sudo ris-admin interface-status --all

# View interface logs
sudo ris-admin interface-logs --interface emr_inbound --errors-only

# Restart specific interface
sudo ris-admin restart-interface --interface emr_inbound
```

## Emergency Procedures

### Critical Issue Response

**Immediate Actions:**

1. **Assess Impact**: Determine scope and severity
2. **Notify Stakeholders**: Alert management and users
3. **Activate Response Team**: Engage technical support
4. **Document Issues**: Record all symptoms and actions
5. **Implement Workarounds**: Activate backup procedures

**Escalation Contacts:**

- **Level 1**: Local IT support team
- **Level 2**: Novarad technical support
- **Level 3**: Novarad engineering team
- **Critical**: 24/7 emergency support line

---

**Related Documentation:**

- [Getting Started Guide](getting-started.md)
- [User Manual](user-manual.md)
- [Integration Guide](integration-guide.md)
