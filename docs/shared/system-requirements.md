# System Requirements

Comprehensive system requirements for all Novarad products.

## Hardware Requirements

### Minimum Requirements

### Server Hardware

- **CPU**: Intel Xeon E5-2600 v4 series or AMD EPYC 7000 series (8 cores minimum)
- **RAM**: 32GB DDR4 ECC memory
- **Storage**: 1TB SSD for system drive, 10TB for data storage
- **Network**: Dual Gigabit Ethernet ports
- **Redundancy**: Redundant power supplies recommended

### Workstation Hardware

- **CPU**: Intel Core i7 or AMD Ryzen 7 (4 cores minimum)
- **RAM**: 16GB DDR4 memory
- **Graphics**: Dedicated graphics card with 4GB VRAM
- **Display**: Dual 24" monitors (medical-grade displays for diagnostic use)
- **Storage**: 500GB SSD for applications and cache

### Recommended Requirements

### Server Hardware

- **CPU**: Intel Xeon Scalable processors or AMD EPYC 7002 series (16+ cores)
- **RAM**: 128GB DDR4 ECC memory or higher
- **Storage**: NVMe SSD for hot data, enterprise SAS/SATA for warm data
- **Network**: 10 Gigabit Ethernet with redundancy
- **Redundancy**: Hot-swappable components, UPS protection

### Workstation Hardware

- **CPU**: Intel Core i9 or AMD Ryzen 9 (8+ cores)
- **RAM**: 32GB DDR4 memory or higher
- **Graphics**: High-end graphics card with 8GB+ VRAM
- **Display**: Dual or triple medical-grade displays (2K or 4K resolution)
- **Storage**: 1TB+ NVMe SSD

## Software Requirements

### Operating Systems

### Server Operating Systems

- **Linux**: Ubuntu 20.04 LTS or CentOS 8.x (recommended)
- **Windows**: Windows Server 2019 or 2022
- **Container Platforms**: Docker 20.x, Kubernetes 1.20+

### Client Operating Systems

- **Windows**: Windows 10 (version 1909 or later) or Windows 11
- **macOS**: macOS 10.15 (Catalina) or later
- **Linux**: Ubuntu 18.04 LTS or later, RHEL 8.x

### Database Requirements

### Supported Database Systems

- **PostgreSQL**: Version 12.x or later (recommended for new installations)
- **Microsoft SQL Server**: 2019 or later
- **Oracle Database**: 19c or later (enterprise environments)
- **MySQL**: Version 8.0 or later (limited support)

### Database Configuration

- **Memory**: Allocate 25-50% of total system RAM to database
- **Storage**: Use SSD storage for database files and transaction logs
- **Backup**: Configure automated backup and point-in-time recovery
- **High Availability**: Consider database clustering for critical environments

### Web Browsers

### Supported Browsers

- **Google Chrome**: Version 90 or later (recommended)
- **Mozilla Firefox**: Version 88 or later
- **Microsoft Edge**: Version 90 or later (Chromium-based)
- **Safari**: Version 14 or later (macOS only)

### Browser Requirements

- **JavaScript**: Must be enabled
- **WebGL**: Required for 3D visualization features
- **Local Storage**: Minimum 50MB available
- **Cookies**: Must be enabled for session management

## Network Requirements

### Bandwidth Requirements

### LAN (Local Area Network)

- **Minimum**: Gigabit Ethernet (1 Gbps)
- **Recommended**: 10 Gigabit Ethernet for high-volume environments
- **Latency**: Less than 5ms between PACS components
- **Redundancy**: Dual network paths recommended

### WAN (Wide Area Network)

- **Remote Sites**: 100 Mbps minimum, 1 Gbps recommended
- **Teleradiology**: 50 Mbps per concurrent user
- **Cloud Integration**: 100 Mbps baseline, scale with usage
- **Backup/Replication**: Additional bandwidth for data synchronization

### Network Ports

#### Standard Ports

| Service | Port | Protocol | Description |
|---------|------|----------|-------------|
| HTTP | 80 | TCP | Web interface (redirect to HTTPS) |
| HTTPS | 443 | TCP | Secure web interface |
| DICOM | 104 | TCP | Medical image communication |
| HL7 | 6661 | TCP | Healthcare messaging |
| SSH | 22 | TCP | Secure remote administration |
| Database | 5432/1433 | TCP | Database connections |

#### Custom Ports

- **API Gateway**: 8443 (HTTPS)
- **Monitoring**: 9090 (Prometheus)
- **Object Storage**: 9000 (MinIO/S3 compatible)
- **Message Queue**: 5672 (RabbitMQ)

### Security Requirements

### Firewall Configuration

- **DMZ**: Web servers and load balancers
- **Internal Network**: Application servers and databases
- **Management Network**: Administrative access only
- **Backup Network**: Isolated backup traffic

### VPN Requirements

- **Protocol**: IPsec or SSL VPN
- **Encryption**: AES-256 minimum
- **Authentication**: Multi-factor authentication required
- **Bandwidth**: Dedicated VPN capacity for remote access

## Storage Requirements

### Storage Architecture

### Tiered Storage Strategy

- **Tier 1 (Hot)**: NVMe SSD for current studies (0-30 days)
- **Tier 2 (Warm)**: SAS SSD for recent studies (30 days - 2 years)
- **Tier 3 (Cold)**: Enterprise SATA for archived studies (2+ years)
- **Tier 4 (Archive)**: Tape or cloud storage for long-term retention

### Storage Capacity Planning

| Modality | Average Study Size | Daily Volume | Annual Storage |
|----------|-------------------|--------------|----------------|
| CT | 200 MB | 50 studies | 3.65 TB |
| MRI | 300 MB | 30 studies | 3.29 TB |
| X-Ray | 50 MB | 100 studies | 1.83 TB |
| Ultrasound | 100 MB | 40 studies | 1.46 TB |
| Mammography | 150 MB | 25 studies | 1.37 TB |

### Performance Requirements

### IOPS (Input/Output Operations Per Second)

- **Database Storage**: 10,000+ IOPS for transaction logs
- **Image Storage**: 5,000+ IOPS for concurrent access
- **Archive Storage**: 1,000+ IOPS for retrieval operations

### Throughput

- **Image Retrieval**: 500 MB/s sustained throughput
- **Backup Operations**: 1 GB/s for efficient backup windows
- **Replication**: 200 MB/s for real-time data synchronization

## Security and Compliance

### HIPAA Compliance

### Technical Safeguards

- **Access Control**: Unique user identification and automatic logoff
- **Audit Controls**: Hardware, software, and procedural mechanisms
- **Integrity**: Electronic PHI must not be improperly altered or destroyed
- **Transmission Security**: Secure data transmission over networks

### Administrative Safeguards

- **Security Officer**: Designated security responsibility
- **Workforce Training**: Security awareness and procedures
- **Information System Review**: Regular security evaluations
- **Business Associate Agreements**: Third-party compliance requirements

### Encryption Requirements

### Data at Rest

- **Algorithm**: AES-256 encryption
- **Key Management**: Hardware security modules (HSM) or key management service
- **Database**: Transparent data encryption (TDE) for sensitive data
- **Storage**: Full disk encryption for all storage devices

### Data in Transit

- **Protocol**: TLS 1.3 for web communications
- **VPN**: IPsec or SSL VPN for remote access
- **API**: HTTPS with certificate pinning
- **Database**: Encrypted database connections

## Performance and Scalability

### Performance Targets

### Response Time Requirements

- **Web Interface**: Page load time < 2 seconds
- **Image Retrieval**: First image display < 3 seconds
- **Search Operations**: Results display < 5 seconds
- **Report Generation**: Standard reports < 10 seconds

### Throughput Requirements

- **Concurrent Users**: Support 100+ concurrent users
- **Image Upload**: Process 1000+ images per hour
- **Data Backup**: Complete daily backup within 8-hour window
- **Disaster Recovery**: RTO < 4 hours, RPO < 1 hour

### Scalability Planning

### Horizontal Scaling

- **Load Balancers**: Multiple application servers behind load balancers
- **Database Clustering**: Read replicas and failover clusters
- **Storage Clustering**: Distributed storage with automatic replication
- **Microservices**: Service-oriented architecture for independent scaling

### Capacity Planning

- **Annual Growth**: Plan for 30-50% annual data growth
- **Peak Load**: Design for 3x average load during peak hours
- **Disaster Recovery**: Maintain 2x capacity at backup site
- **Storage Expansion**: Ability to add storage without downtime

## Monitoring and Maintenance

### Monitoring Requirements

### System Monitoring

- **Server Health**: CPU, memory, disk, and network utilization
- **Application Performance**: Response times and error rates
- **Database Performance**: Query performance and connection pools
- **Storage Health**: Disk health, RAID status, and capacity

### Alert Thresholds

- **CPU Utilization**: Alert at 80%, critical at 90%
- **Memory Usage**: Alert at 85%, critical at 95%
- **Disk Space**: Alert at 80%, critical at 90%
- **Response Time**: Alert if > 5 seconds, critical if > 10 seconds

### Maintenance Windows

### Scheduled Maintenance

- **Frequency**: Monthly maintenance windows
- **Duration**: 4-hour maintenance windows
- **Timing**: Outside business hours (weekends preferred)
- **Communication**: 48-hour advance notice required

### Emergency Maintenance

- **Criteria**: Security vulnerabilities or system failures
- **Response Time**: 2-hour maximum response time
- **Communication**: Immediate notification to stakeholders
- **Rollback Plan**: Tested rollback procedures for all changes

## Backup and Disaster Recovery

### Backup Requirements

### Backup Strategy

- **Frequency**: Daily incremental, weekly full backups
- **Retention**: 30 days local, 1 year offsite
- **Testing**: Monthly backup restoration tests
- **Encryption**: All backups encrypted in transit and at rest

### Recovery Objectives

- **RTO (Recovery Time Objective)**: 4 hours maximum
- **RPO (Recovery Point Objective)**: 1 hour maximum data loss
- **Availability**: 99.9% uptime (8.77 hours downtime per year)
- **Data Integrity**: 100% data recovery capability

### Disaster Recovery

### DR Site Requirements

- **Location**: Geographically separated (>100 miles)
- **Capacity**: 100% of production capacity
- **Connectivity**: Dedicated high-speed network connection
- **Testing**: Annual DR testing and validation

### Failover Procedures

- **Automatic Failover**: Critical systems with <5 minute failover
- **Manual Failover**: Non-critical systems with documented procedures
- **Communication**: Automated notification of failover events
- **Fallback**: Tested procedures for returning to primary site

---

### Related Documentation

- [Glossary](glossary.md)
- [Common Procedures](common-procedures.md)
