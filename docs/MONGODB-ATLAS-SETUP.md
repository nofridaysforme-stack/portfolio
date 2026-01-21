# MongoDB Atlas Production Setup Guide

Complete guide for setting up MongoDB Atlas for your portfolio production deployment.

## Overview

MongoDB Atlas is a fully-managed cloud database service that provides:
- Automatic backups and point-in-time recovery
- Built-in monitoring and alerting
- Automatic scaling
- Multi-region deployment options
- Enterprise-grade security

---

## Prerequisites

- MongoDB Atlas account ([sign up free](https://www.mongodb.com/cloud/atlas/register))
- Credit card (required for paid tiers, not needed for M0 free tier)

---

## Step-by-Step Setup

### 1. Create Organization and Project

#### Create Organization (if needed)

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. If this is your first time, you'll be prompted to create an organization
3. Organization name: `Your Name` or `Your Company`
4. Cloud provider: Choose based on preference
5. Click **Continue**

#### Create Project

1. Click **New Project** (or it auto-creates on first login)
2. Project name: `Portfolio Production`
3. Click **Next**
4. Add members (optional): Skip for now
5. Click **Create Project**

---

### 2. Create Database Cluster

#### Choose Cluster Tier

**Development/Testing** (Free):
- Tier: **M0 Sandbox** (Free Forever)
- RAM: 512 MB
- Storage: 5 GB
- Limitations:
  - No backups
  - No advanced monitoring
  - Shared CPU
  - Limited to one free cluster per project

**Production** (Recommended):
- Tier: **M2** or higher
- M2: $9/month, 2 GB RAM, 10 GB storage
- M5: $25/month, 8 GB RAM, 25 GB storage
- Features:
  - Automated backups
  - Advanced monitoring
  - Dedicated CPU
  - Better performance

#### Configure Cluster

1. Click **Build a Database**
2. Choose deployment type: **Shared** (for M0/M2/M5) or **Dedicated** (M10+)
3. Cloud Provider & Region:
   - Provider: **AWS** (recommended), **Google Cloud**, or **Azure**
   - Region: Choose closest to your Vercel deployment
     - US East (N. Virginia) `us-east-1` - Good for eastern US/Europe
     - US West (Oregon) `us-west-2` - Good for western US/Asia
     - Europe (Frankfurt) `eu-central-1` - Good for Europe
     - Asia (Singapore) `ap-southeast-1` - Good for Asia
4. Cluster Tier: Select tier (M0, M2, M5, etc.)
5. Additional Settings:
   - MongoDB Version: **7.0** (latest stable)
   - Backup: **Enabled** (M2+ only)
6. Cluster Name: `portfolio-production`
7. Click **Create Cluster**

⏱️ Cluster creation takes 5-10 minutes

---

### 3. Configure Database Access

#### Create Database User

1. While cluster is creating, go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Authentication Method: **Password**
4. Username: `portfolio_admin` (or your choice)
5. Password: Click **Autogenerate Secure Password** or create your own
   - **IMPORTANT**: Copy and save this password securely!
   - Recommendation: Use a password manager
6. Database User Privileges:
   - Built-in Role: **Read and write to any database**
   - Or: **Atlas admin** (for full control)
7. Restrict Access to Specific Clusters/Databases (optional):
   - Leave default (all clusters)
8. Temporary User: **No**
9. Click **Add User**

#### Password Requirements

- Minimum 8 characters
- Mix of uppercase and lowercase
- Include numbers
- Include special characters
- Avoid: `@`, `:`, `/`, `?`, `#`, `[`, `]`, `@` (can cause issues in connection strings)
- Good example: `K7mP#9xL2nQ5vR8w`

---

### 4. Configure Network Access

#### Add IP Addresses

1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**

**For Production (Vercel)**:

Option A: Allow All (Simplest)
- Click **Allow Access from Anywhere**
- IP Address: `0.0.0.0/0`
- Description: `Vercel Production`
- Click **Confirm**

Option B: Vercel IP Ranges (More Secure)
- Vercel doesn't provide fixed IPs for hobby/pro plans
- Enterprise plans get fixed IPs
- For hobby/pro: Use option A

**For Development**:
- Click **Add Current IP Address**
- Description: `My Development Machine`
- Click **Confirm**

#### Security Notes

- `0.0.0.0/0` allows connections from any IP address
- This is generally safe because:
  - Authentication still required (username/password)
  - Connection string is secret
  - TLS encryption enforced
- For enhanced security:
  - Use VPN
  - Use MongoDB Atlas PrivateLink (enterprise)
  - Implement application-level security

---

### 5. Get Connection String

#### Retrieve Connection String

1. Go to **Database** (left sidebar)
2. Wait for cluster status to show **Active** (green)
3. Click **Connect** button on your cluster
4. Choose connection method: **Connect your application**
5. Driver: **Node.js**
6. Version: **5.5 or later**
7. Copy the connection string:

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

#### Modify Connection String

Replace placeholders:

```
mongodb+srv://portfolio_admin:K7mP#9xL2nQ5vR8w@portfolio-production.abc123.mongodb.net/?retryWrites=true&w=majority
```

Add database name:

```
mongodb+srv://portfolio_admin:K7mP#9xL2nQ5vR8w@portfolio-production.abc123.mongodb.net/portfolio_production?retryWrites=true&w=majority
```

#### Connection String Components

```
mongodb+srv://[username]:[password]@[cluster].[id].mongodb.net/[database]?[options]
```

- `mongodb+srv://` - Protocol (DNS seedlist)
- `username` - Database user (e.g., `portfolio_admin`)
- `password` - User password (URL encode special characters!)
- `cluster.id.mongodb.net` - Cluster hostname
- `database` - Database name (e.g., `portfolio_production`)
- `?options` - Connection options

#### Special Characters in Password

If password contains special characters, URL encode them:

| Character | URL Encoded |
|-----------|-------------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `[` | `%5B` |
| `]` | `%5D` |
| `%` | `%25` |

Example:
```
Password: myP@ss:word/123
Encoded:  myP%40ss%3Aword%2F123
```

---

### 6. Test Connection

#### Test Locally

1. Create `.env.local` file:

```env
DATABASE_URI=mongodb+srv://portfolio_admin:password@cluster.mongodb.net/portfolio_production?retryWrites=true&w=majority
```

2. Run your application:

```bash
npm run dev
```

3. Check logs for successful connection:

```
✓ Connected to MongoDB
```

#### Test with MongoDB Compass (GUI)

1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Open Compass
3. Paste connection string
4. Click **Connect**
5. You should see your database and collections

#### Test with mongosh (CLI)

```bash
# Install mongosh
brew install mongosh  # macOS
# or download from mongodb.com

# Connect
mongosh "mongodb+srv://portfolio_admin:password@cluster.mongodb.net/portfolio_production"

# Show databases
show dbs

# Use database
use portfolio_production

# Show collections
show collections
```

---

### 7. Create Indexes for Performance

After your application creates collections, add indexes:

#### Via MongoDB Atlas UI

1. Go to **Database** > **Browse Collections**
2. Select collection (e.g., `projects`)
3. Click **Indexes** tab
4. Click **Create Index**
5. Add index definition

#### Recommended Indexes

**Projects Collection**:

```javascript
// Slug index (unique)
{ "slug": 1 }
// Options: { unique: true }

// Status + Featured (for homepage)
{ "status": 1, "featured": 1 }

// Category (for filtering)
{ "category": 1 }

// Created date (for sorting)
{ "createdAt": -1 }

// Full text search (optional)
{ "title": "text", "description": "text", "tags": "text" }
```

**Pages Collection**:

```javascript
// Slug index (unique)
{ "slug": 1 }
// Options: { unique: true }

// Status
{ "status": 1 }
```

**Users Collection**:

```javascript
// Email index (unique) - usually auto-created by Payload
{ "email": 1 }
// Options: { unique: true }

// Firebase UID (unique)
{ "firebaseUid": 1 }
// Options: { unique: true }
```

**Media Collection**:

```javascript
// Filename
{ "filename": 1 }

// Created date
{ "createdAt": -1 }
```

#### Via Mongoose (Code)

Payload CMS automatically creates some indexes, but you can add more:

```typescript
// In collection config
const Projects = {
  slug: 'projects',
  fields: [
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true, // Creates index automatically
    },
    // ...
  ],
}
```

---

### 8. Configure Backups (M2+ Only)

#### Enable Cloud Backups

1. Go to **Backup** (left sidebar)
2. Click **Enable Cloud Backup** (if not already enabled)
3. Configure backup policy:

**Snapshot Frequency**:
- Daily: Every 24 hours
- Hourly: Every 6 hours (M10+)
- Weekly: Every Sunday

**Retention**:
- Daily snapshots: 7 days (recommended minimum)
- Weekly snapshots: 4 weeks
- Monthly snapshots: 12 months

**Continuous Cloud Backup** (M10+):
- Point-in-time recovery
- Restore to any point within retention window
- Highly recommended for production

4. Click **Save**

#### Test Backup Restore (Recommended)

1. Go to **Backup** > **Snapshots**
2. Find a snapshot
3. Click **Restore**
4. Choose restore method:
   - **Restore to new cluster** (safest for testing)
   - Download snapshot
5. Verify data integrity

#### Backup Best Practices

- ✅ Test restores regularly (monthly)
- ✅ Enable continuous backups (M10+)
- ✅ Store export locally as additional backup
- ✅ Document restore procedures
- ✅ Set retention based on compliance needs

---

### 9. Configure Monitoring and Alerts

#### Enable Monitoring

1. Go to **Metrics** (cluster page)
2. View metrics:
   - Operations per second
   - Network traffic
   - Connections
   - Memory usage
   - Disk IOPS

#### Set Up Alerts

1. Go to **Alerts** (left sidebar)
2. Click **Add New Alert**
3. Create alerts for:

**High Connection Count**:
- Alert type: **Connections**
- Threshold: 80% of max connections
- Notification: Email

**High CPU Usage**:
- Alert type: **System CPU**
- Threshold: >80% for 10 minutes
- Notification: Email

**Low Disk Space**:
- Alert type: **Disk Space**
- Threshold: <10% free space
- Notification: Email

**Replication Lag** (for replica sets):
- Alert type: **Replication Lag**
- Threshold: >10 seconds
- Notification: Email

4. Add notification methods:
   - Email
   - SMS (additional charges)
   - PagerDuty (enterprise)
   - Slack webhook

---

### 10. Security Hardening

#### Enable Encryption

**Encryption at Rest**:
- Automatically enabled for M10+ clusters
- Uses AES-256 encryption
- No configuration needed

**Encryption in Transit**:
- TLS 1.2+ enforced automatically
- Cannot be disabled

#### Enable Auditing (M10+ only)

1. Go to **Advanced** (cluster settings)
2. Enable **Database Auditing**
3. Configure audit filter:

```json
{
  "atype": "authenticate",
  "result": 0
}
```

This logs failed authentication attempts.

#### IP Access List Management

- ✅ Regularly review IP access list
- ✅ Remove unused IPs
- ✅ Use description field for context
- ✅ Consider VPN for team access

#### Database User Management

- ✅ Use separate users for different services
- ✅ Grant minimum necessary privileges
- ✅ Rotate passwords regularly (every 90 days)
- ✅ Use strong passwords (20+ characters)
- ✅ Enable 2FA for Atlas account

---

## Connection String for Vercel

### Add to Vercel Environment Variables

1. Go to Vercel Dashboard > Project > Settings > Environment Variables
2. Add variable:
   - Name: `DATABASE_URI`
   - Value: Your connection string
   - Environments: Production, Preview
3. Click **Save**

### Testing in Preview

After adding to Vercel:

1. Deploy to preview: `vercel`
2. Check logs: `vercel logs`
3. Look for connection success message
4. Test `/api/health` endpoint

---

## Maintenance Tasks

### Regular Maintenance Checklist

**Weekly**:
- [ ] Review performance metrics
- [ ] Check connection count trends
- [ ] Review slow query logs

**Monthly**:
- [ ] Test backup restore
- [ ] Review and optimize indexes
- [ ] Check disk usage trends
- [ ] Review security alerts

**Quarterly**:
- [ ] Rotate database passwords
- [ ] Review and update IP access list
- [ ] Audit database users and permissions
- [ ] Review cluster tier (scale if needed)

---

## Troubleshooting

### Connection Issues

**Error**: `MongoServerError: bad auth : Authentication failed`

**Solutions**:
1. Verify username and password
2. Check special characters are URL encoded
3. Verify user exists in Database Access
4. Check user has correct privileges

**Error**: `MongooseServerSelectionError: Could not connect to any servers`

**Solutions**:
1. Check IP is whitelisted (0.0.0.0/0)
2. Verify connection string format
3. Check cluster is running (Status: Active)
4. Verify network connectivity

**Error**: `Error: querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net`

**Solutions**:
1. Check DNS resolution
2. Verify connection string is correct
3. Try using `mongodb://` instead of `mongodb+srv://`

### Performance Issues

**Slow Queries**:
1. Go to **Performance Advisor**
2. Review suggested indexes
3. Create recommended indexes
4. Monitor query performance

**High Connection Count**:
1. Check for connection leaks in code
2. Implement connection pooling
3. Close connections properly
4. Consider upgrading cluster tier

**Memory Issues**:
1. Review working set size
2. Add more RAM (upgrade tier)
3. Optimize queries and indexes
4. Consider sharding (M30+)

---

## Scaling

### When to Scale

Scale up when:
- CPU consistently >70%
- Memory consistently >80%
- Connection count >80% of limit
- Disk space <20% free
- Query performance degrading

### Scaling Options

**Vertical Scaling** (Increase Cluster Tier):
- M0 → M2 ($9/month)
- M2 → M5 ($25/month)
- M5 → M10 ($57/month)

**Horizontal Scaling** (Sharding):
- Available M30+ ($110+/month)
- Distributes data across multiple shards
- For very large datasets (100+ GB)

**Read Replicas**:
- Available M10+
- Add read-only replicas
- Distribute read load

---

## Cost Optimization

### Free Tier (M0)

**Includes**:
- 512 MB RAM
- 5 GB storage
- Shared vCPU
- One per project

**Limitations**:
- No backups
- No monitoring
- No advanced features
- Can get rate limited

**Good For**:
- Development
- Testing
- Small personal projects

### Paid Tiers

**M2** ($9/month):
- 2 GB RAM, 10 GB storage
- Backups enabled
- Monitoring included
- Good for small production sites

**M5** ($25/month):
- 8 GB RAM, 25 GB storage
- Better performance
- Good for medium traffic sites

**Cost Control Tips**:
- ✅ Start small, scale as needed
- ✅ Use preview/staging on M0
- ✅ Monitor usage regularly
- ✅ Optimize queries to reduce load
- ✅ Archive old data
- ✅ Set billing alerts

---

## Checklist

### Initial Setup
- [ ] MongoDB Atlas account created
- [ ] Organization and project created
- [ ] Cluster created and active
- [ ] Database user created with strong password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Database name added to connection string
- [ ] Special characters in password URL encoded

### Testing
- [ ] Connection tested locally
- [ ] Connection tested in MongoDB Compass
- [ ] Test data created and queried
- [ ] Collections and indexes created

### Production Configuration
- [ ] Connection string added to Vercel
- [ ] Backups enabled (M2+)
- [ ] Monitoring and alerts configured
- [ ] Indexes created for performance
- [ ] Backup restore tested

### Security
- [ ] Strong password used
- [ ] IP access list configured
- [ ] User privileges minimized
- [ ] 2FA enabled on Atlas account
- [ ] Encryption verified (at rest and in transit)

---

## Quick Reference

### Connection String Format

```
mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]?retryWrites=true&w=majority
```

### Common Commands

```bash
# Connect with mongosh
mongosh "your-connection-string"

# Show databases
show dbs

# Use database
use portfolio_production

# Show collections
show collections

# Count documents
db.projects.countDocuments()

# Find all documents
db.projects.find().pretty()

# Create index
db.projects.createIndex({ "slug": 1 }, { unique: true })

# Show indexes
db.projects.getIndexes()
```

### Support Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/) (free courses)
- [Community Forums](https://www.mongodb.com/community/forums/)
- [Support Portal](https://support.mongodb.com/) (paid plans)

---

**Last Updated**: January 2026
**Version**: 1.0.0
