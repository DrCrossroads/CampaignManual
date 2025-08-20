# PACS Troubleshooting Guide

This guide provides solutions to common issues encountered when using the Novarad PACS system.

## Table of Contents

- [Connection Issues](#connection-issues)
- [Image Display Problems](#image-display-problems)
- [Performance Issues](#performance-issues)
- [DICOM Communication](#dicom-communication)
- [Authentication Problems](#authentication-problems)
- [Storage and Database](#storage-and-database)
- [Network Configuration](#network-configuration)
- [Browser Compatibility](#browser-compatibility)
- [Getting Additional Support](#getting-additional-support)

## Connection Issues

### Cannot Connect to PACS Server

**Symptoms:**

- Login screen doesn't appear
- "Connection refused" errors
- Timeout errors

**Solutions:**

1. **Check Network Connection**
   - Verify internet connectivity
   - Ensure VPN connection is active (if required)
   - Test connection to server IP address

2. **Verify Server Status**
   - Contact system administrator
   - Check server maintenance schedule
   - Verify server is running

3. **Browser Settings**
   - Clear browser cache and cookies
   - Disable browser extensions
   - Try incognito/private browsing mode

### Frequent Disconnections

**Symptoms:**

- Session expires unexpectedly
- Need to log in repeatedly
- Connection drops during use

**Solutions:**

1. **Check Session Settings**
   - Contact administrator to extend session timeout
   - Ensure auto-logout settings are appropriate

2. **Network Stability**
   - Check for network interruptions
   - Verify stable internet connection
   - Consider ethernet connection over Wi-Fi

## Image Display Problems

### Images Not Loading

**Symptoms:**

- Black or blank image viewers
- Loading indicators that never complete
- Error messages when opening studies

**Solutions:**

1. **Browser Configuration**
   - Enable JavaScript
   - Allow pop-ups from PACS domain
   - Update browser to latest version

2. **Image Cache**
   - Clear browser cache
   - Allow sufficient disk space for image caching
   - Check browser storage settings

3. **Network Bandwidth**
   - Check internet speed
   - Consider reducing image quality for slower connections
   - Contact IT for bandwidth optimization

### Poor Image Quality

**Symptoms:**

- Blurry or pixelated images
- Slow image rendering
- Missing image layers

**Solutions:**

1. **Display Settings**
   - Adjust window/level settings
   - Check monitor resolution settings
   - Calibrate monitor if necessary

2. **Compression Settings**
   - Contact administrator to adjust compression levels
   - Request higher quality settings for diagnostic viewing

## Performance Issues

### Slow System Response

**Symptoms:**

- Slow loading times
- Delayed image rendering
- Unresponsive interface

**Solutions:**

1. **System Resources**
   - Close unnecessary browser tabs
   - Restart browser
   - Restart computer if needed

2. **Network Optimization**
   - Check available bandwidth
   - Avoid peak usage times if possible
   - Consider wired connection over wireless

3. **Browser Optimization**
   - Update to latest browser version
   - Disable unnecessary extensions
   - Clear browser cache regularly

### Memory Issues

**Symptoms:**

- Browser crashes
- "Out of memory" errors
- System freezing

**Solutions:**

1. **Browser Memory Management**
   - Close unused browser tabs
   - Restart browser periodically
   - Use browsers with better memory management

2. **System Memory**
   - Close other applications
   - Add more RAM if consistently problematic
   - Monitor system memory usage

## DICOM Communication

### DICOM Send/Receive Failures

**Symptoms:**

- Studies not arriving from modalities
- Failed transmissions to other systems
- DICOM association errors

**Solutions:**

1. **Network Configuration**
   - Verify DICOM port settings (default 104)
   - Check firewall configurations
   - Confirm AE Title settings

2. **DICOM Settings**
   - Verify modality configurations
   - Check DICOM service status
   - Validate transfer syntax settings

### Study Routing Issues

**Symptoms:**

- Studies arriving in wrong locations
- Missing study notifications
- Incorrect worklist assignments

**Solutions:**

1. **Routing Rules**
   - Review study routing configurations
   - Check modality identification settings
   - Verify location assignments

2. **Workflow Configuration**
   - Confirm user assignments
   - Check department routing rules
   - Review priority settings

## Authentication Problems

### Login Failures

**Symptoms:**

- Invalid username/password errors
- Account locked messages
- Authentication timeout

**Solutions:**

1. **Credential Verification**
   - Verify username and password
   - Check for caps lock
   - Try password reset if available

2. **Account Status**
   - Contact administrator for account status
   - Check for account expiration
   - Verify user permissions

### Permission Issues

**Symptoms:**

- Access denied to certain studies
- Missing menu options
- Unable to perform certain actions

**Solutions:**

1. **User Permissions**
   - Contact administrator to review permissions
   - Verify role assignments
   - Check department access rights

2. **Group Memberships**
   - Confirm correct user groups
   - Review location-based permissions
   - Check specialty-specific access

## Storage and Database

### Study Availability Issues

**Symptoms:**

- Studies not found
- "Study archived" messages
- Incomplete study lists

**Solutions:**

1. **Search Parameters**
   - Expand date ranges
   - Check spelling of patient names
   - Use different search criteria

2. **Archive Status**
   - Contact administrator for archived studies
   - Request study restoration if needed
   - Check offline storage status

### Database Performance

**Symptoms:**

- Slow search results
- Database timeout errors
- Incomplete query responses

**Solutions:**

1. **Query Optimization**
   - Use more specific search criteria
   - Limit date ranges
   - Search by specific parameters

2. **System Resources**
   - Contact administrator about database performance
   - Report specific slow operations
   - Consider off-peak usage times

## Network Configuration

### Firewall Issues

**Symptoms:**

- Connection blocked messages
- Partial functionality
- Intermittent access problems

**Solutions:**

1. **Port Requirements**
   - Ensure required ports are open
   - Configure firewall exceptions
   - Work with IT security team

2. **Proxy Settings**
   - Configure browser proxy settings
   - Bypass proxy for PACS domains
   - Check corporate network policies

### VPN Connectivity

**Symptoms:**

- Cannot access PACS remotely
- VPN connection failures
- Slow performance over VPN

**Solutions:**

1. **VPN Configuration**
   - Verify VPN client settings
   - Check VPN server status
   - Update VPN client software

2. **Remote Access**
   - Test alternative remote access methods
   - Check bandwidth limitations
   - Consider dedicated remote access solutions

## Browser Compatibility

### Supported Browsers

**Recommended Browsers:**

- Google Chrome (latest version)
- Mozilla Firefox (latest version)
- Microsoft Edge (latest version)
- Safari (latest version)

### Browser Settings

**Required Settings:**

- JavaScript enabled
- Cookies enabled
- Pop-ups allowed for PACS domain
- Local storage enabled

### Plugin Requirements

**May Require:**

- Updated Java runtime (for legacy viewers)
- Adobe Flash Player (if applicable)
- Specific PACS viewer plugins

## Getting Additional Support

### Contact Information

**Technical Support:**

- Email: [support@novarad.com](mailto:support@novarad.com)
- Phone: Contact your system administrator for support number
- Help Desk: Use internal ticketing system if available

**Documentation:**

- Getting Started: [getting-started.md](getting-started.md)
- User Manual: [user-manual.md](user-manual.md)
- Admin Guide: [admin-guide.md](admin-guide.md)

### Information to Provide

When contacting support, include:

- **System Information:**
  - Browser type and version
  - Operating system
  - Computer specifications

- **Error Details:**
  - Exact error messages
  - Steps to reproduce the issue
  - Screenshots if helpful

- **Environment:**
  - Network configuration
  - VPN usage
  - Time of occurrence

### Emergency Procedures

**For Critical Issues:**

1. Contact system administrator immediately
2. Document the issue and impact
3. Use backup systems if available
4. Follow established escalation procedures

**System Outages:**

1. Check with other users to confirm outage
2. Report to appropriate personnel
3. Use alternative workflows if necessary
4. Monitor status updates

---

*Last updated: June 2025*
*Document version: 1.0*
