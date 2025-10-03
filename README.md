<div align="center">
  <img src="public/flow-logo.svg" alt="Flow Logo" width="120" height="120">
  
  # 🚀 Flow Payment Gateway
  
  ### *Seamless Multi-Token Payments → USDT for Small Businesses*
  
  [![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-flow.almoloo.com-8B5CF6?style=for-the-badge)](https://flow.almoloo.com)
  [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](https://opensource.org/licenses/Apache-2.0)
  [![Built on Aptos](https://img.shields.io/badge/⚡_Built_on-Aptos-000000?style=for-the-badge)](https://aptosfoundation.org/)
  
  ![Flow Preview](https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Flow+Payment+Gateway+Interface)
  
</div>

---

## 🎯 What is Flow?

**Flow** is a decentralized payment gateway that revolutionizes how small businesses accept crypto payments. Customers can pay with **any supported token** while vendors receive **stable USDT**, eliminating volatility concerns and simplifying crypto adoption for businesses.

### 🌟 Key Features

- 💱 **Multi-Token Support** - Accept payments in APT, BTC, USDT, and more
- 🔄 **Automatic Swapping** - Seamless token conversion using Liquidswap DEX
- 💰 **USDT Settlement** - Vendors always receive stable USDT
- 🤖 **AI Support Agent** - Intelligent customer support powered by OpenAI
- 📱 **Mobile-First Design** - PWA-ready responsive interface
- 🔗 **Payment Links** - Generate shareable short links for easy payments
- 👥 **Customer Management** - Track customers and transaction history
- 📊 **Analytics Dashboard** - Comprehensive transaction insights

![Payment Flow](https://via.placeholder.com/800x300/8B5CF6/FFFFFF?text=Customer+Pays+Any+Token+→+Flow+Converts+→+Vendor+Receives+USDT)

---

## 🚀 Live Demo

**🌐 [Try Flow Payment Gateway](https://flow.almoloo.com)**

**🖌️ [View UI design on Figma](https://www.figma.com/design/JZYe6ZUXTihQW0F7Yp7lZb/Payment-Gateway?node-id=2443-5934&t=VJKijxi4elCUF5xV-1)**

**📍 Contract Address:** `0x79df95a22ef10e02273b3e75a195fa3416f1993ae150a2b1b993bb27fe3171bb`

### Demo Scenarios

- **Vendor Dashboard**: Create payment gateways and track transactions
- **Customer Payment**: Experience seamless multi-token payments
- **AI Support**: Chat with the intelligent support agent
- **Mobile Experience**: Test the PWA on mobile devices

---

### 🛠️ Tech Stack

**Frontend**

- ⚛️ **Next.js 14** - React framework with App Router
- 🎨 **Tailwind CSS + shadcn/ui** - Modern, accessible UI components
- 📱 **PWA Ready** - Offline support and mobile app experience
- 🔗 **React Query** - Efficient data fetching and caching

**Blockchain**

- ⚡ **Aptos Blockchain** - Fast, secure, and scalable
- 🔄 **Move Smart Contracts** - Type-safe blockchain programming
- 🪙 **Liquidswap Integration** - Decentralized token swapping
- 👛 **Aptos Wallet Adapter** - Multi-wallet support

**Backend & Infrastructure**

- 🗄️ **MongoDB** - Flexible document database
- 📁 **MinIO** - S3-compatible object storage
- 🤖 **OpenAI GPT-4** - Intelligent customer support
- 🔐 **JWT Authentication** - Secure user sessions

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **npm**
- **Git** for version control
- **Aptos CLI** for Move contract deployment

### 1️⃣ Clone & Install

```bash
git clone https://github.com/almoloo/flow.git
cd flow
npm install
```

### 2️⃣ Environment Setup

Create `.env.local` file in the root directory:

```env
# 🌐 Application Network (testnet | mainnet | devnet)
NEXT_PUBLIC_APP_NETWORK=testnet
NEXT_PUBLIC_MODULE_ADDRESS=0x79df95a22ef10e02273b3e75a195fa3416f1993ae150a2b1b993bb27fe3171bb
NEXT_PUBLIC_APTOS_API_KEY=your_aptos_api_key

# 📱 Publisher Account (for Move contracts)
NEXT_MODULE_PUBLISHER_ACCOUNT_ADDRESS=your_publisher_address

# 🗄️ Database Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=flow_db

# 📁 File Storage (MinIO/S3)
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=flow-storage
MINIO_REGION=us-east-1

# 🤖 AI Support Agent
OPENAI_API_KEY=your_openai_api_key

# 💰 Price API
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
```

### 3️⃣ Database Setup

```bash
# Start MongoDB (using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Start MinIO (using Docker)
docker run -d -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  --name minio quay.io/minio/minio server /data --console-address ":9001"
```

### 4️⃣ Deploy Smart Contract

```bash
# Compile the Move contract
npm run move:compile

# Test the contract
npm run move:test

# Deploy to network
npm run move:publish
```

### 5️⃣ Run Development Server

```bash
npm run dev
```

🎉 **Open [http://localhost:3000](http://localhost:3000)** to see Flow in action!

---

## 📖 Usage Guide

### For Vendors

#### 1. **Setup Your Vendor Profile**

```bash
# Connect your Aptos wallet
# Navigate to /dashboard/profile
# Fill in business information and upload avatar
```

#### 2. **Create Payment Gateway**

```typescript
// Create a new gateway with custom metadata
const gateway = {
  label: "Online Store Checkout",
  metadata: JSON.stringify({
    description: "Payment for digital products",
    returnUrl: "https://mystore.com/success",
  }),
};
```

#### 3. **Generate Payment Links**

```bash
# Payment URL format:
https://flow.almoloo.com/payment?va={vendor_address}&gid={gateway_id}&amount={usdt_amount}

# Short link format:
https://flow.almoloo.com/p/{short_id}
```

### For Developers

#### 🔧 Available Scripts

```bash
# 🏗️ Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# 🔗 Blockchain
npm run move:compile # Compile Move contracts
npm run move:test    # Run Move unit tests
npm run move:publish # Deploy contracts to network
npm run move:upgrade # Upgrade existing contracts

# 🎨 Code Quality
npm run lint         # Run ESLint
npm run fmt          # Format code with Prettier

# 🚀 Deployment
npm run deploy       # Deploy to Vercel
```

#### 🌐 API Endpoints

```typescript
// Customer Management
GET    /api/customer              // List all customers
GET    /api/customer/[address]    // Get specific customer
POST   /api/customer              // Create new customer
GET    /api/customer/export       // Export customer data as CSV

// Transaction Handling
GET    /api/transaction           // List transactions
POST   /api/transaction           // Create new transaction

// Vendor Operations
GET    /api/vendor/[address]      // Get vendor information
POST   /api/vendor                // Update vendor profile

// Utility Services
GET    /api/calculate             // Get token swap rates
POST   /api/image/upload          // Upload images to MinIO
GET    /api/short-link/[id]       // Resolve short links
POST   /api/support-agent/[address]/chat // AI support chat
```

---

## 🏛️ Smart Contract Architecture

### Core Modules

#### 📋 **Vendor Management**

```move
struct Vendor has key {
    owner: address,
    name: String,
    balance: u64,
    gateways: vector<Gateway>,
}

public entry fun init_vendor(sender: &signer, vendor_name: String)
public entry fun update_vendor_name(sender: &signer, new_name: String)
```

#### 🚪 **Gateway System**

```move
struct Gateway has store {
    id: u64,
    label: String,
    metadata: String,
    is_active: bool,
    payments: Table<u64, Payment>,
}

public entry fun add_gateway(sender: &signer, label: String, metadata: String)
public entry fun update_gateway_status(sender: &signer, gateway_id: u64, is_active: bool)
```

#### 💳 **Payment Processing**

```move
public entry fun pay_to_vendor_apt(
    sender: &signer,
    vendor_addr: address,
    gateway_id: u64,
    payment_id: u64,
    aptos_amount_to_swap: u64
)

public entry fun pay_to_vendor(
    sender: &signer,
    vendor_addr: address,
    gateway_id: u64,
    payment_id: u64,
    amount: u64
)
```

### 🔄 Supported Networks

| Network     | Status         |
| ----------- | -------------- |
| **Testnet** | ✅ Tested      |
| **Devnet**  | ✅ Tested      |
| **Mainnet** | 🟦 Should work |

---

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

### 🐛 Found a Bug?

1. **Check existing issues** in our [GitHub Issues](https://github.com/almoloo/flow/issues)
2. **Create a detailed bug report** with steps to reproduce
3. **Include environment details** (OS, browser, wallet, etc.)

### 💡 Have a Feature Idea?

1. **Open a feature request** describing your idea
2. **Discuss implementation** with the community
3. **Submit a pull request** with your changes

### 🔧 Development Workflow

```bash
# Fork the repository
git fork https://github.com/almoloo/flow.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make your changes
git commit -m "feat: add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

### 📝 Contribution Guidelines

- **Code Style**: Follow existing patterns and run `npm run lint`
- **Testing**: Add tests for new features
- **Documentation**: Update README and inline comments
- **Commits**: Use conventional commit messages

---

## 📞 Support & Community

### 🆘 Need Help?

- 📧 **Email**: amousavig@icloud.com

### 🐛 Bug Reports & Feature Requests

- 🎯 **GitHub Issues**: [Report bugs or request features](https://github.com/almoloo/flow/issues)
- 💡 **Discussions**: [Join technical discussions](https://github.com/almoloo/flow/discussions)

### 🤝 Professional Services

Need custom implementation or integration support?

- 📩 **Business Inquiries**: hi@almoloo.com

---

## 📄 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- 💜 **Aptos Foundation** - For the incredible blockchain infrastructure
- 🔄 **Liquidswap** - For decentralized exchange integration
- 🎨 **shadcn/ui** - For beautiful, accessible UI components
- 🤖 **OpenAI** - For powering our AI support agent
- 🌟 **Open Source Community** - For inspiring innovation

---

<div align="center">
  
  ### ⭐ Star us on GitHub if Flow helped your business!
  
  [![GitHub stars](https://img.shields.io/github/stars/almoloo/flow?style=social)](https://github.com/almoloo/flow/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/almoloo/flow?style=social)](https://github.com/almoloo/flow/network)
  
  **Built with ❤️ by [Ali](https://github.com/almoloo) & [Hossein](https://github.com/Hossein-79)**
  
</div>
