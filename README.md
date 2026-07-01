# Polypharmacy Manager - Digital Health Application

A comprehensive mobile health application for managing polypharmacy in non-communicable diseases (NCDs) such as hypertension, diabetes, heart failure, and COPD.

## 🌟 Features

### Core Modules

1. **Polypharmacy Manager**
   - Track multiple medications
   - Drug-drug interaction (DDI) alerts with severity grading
   - Personalized dosing schedules
   - Medication history and adherence tracking

2. **Smart Exercise & Diet Programs**
   - Disease-specific exercise plans (hypertension, diabetes, heart failure, COPD)
   - Customized dietary guides (low-sodium, low-GI, etc.)
   - Safety precautions for each condition

3. **Clinical Pharmacist Consultancy**
   - In-app chat and video calls with licensed pharmacists
   - Medication reviews and side effect management
   - Real-time counseling and support

4. **Drug Locator**
   - Real-time map showing nearby pharmacies
   - Stock availability for prescribed medications
   - Hospital and clinic locations

5. **Multilingual & Voice-Accessible Education**
   - Content in 5 languages: Amharic, Guragigna, Tigrinya, Oromiffa, English
   - Voice navigation and audio content
   - Accessible for visually impaired and low-literacy users

6. **Medication Reminders & Adherence Tracking**
   - Smart push notifications
   - Dose confirmation and missed dose logging
   - Refill predictions and alerts
   - Adherence reports and analytics

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platform
npm run android    # For Android
npm run ios        # For iOS
npm run web        # For web
```

### Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Configure your environment variables
3. Restart the development server

## 📁 Project Structure

```
polypharmacy-manager/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based navigation screens
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Home screen
├── components/            # Reusable UI components
│   ├── common/           # Shared components
│   ├── medication/       # Medication-specific components
│   ├── exercise/         # Exercise components
│   └── consultation/     # Consultation components
├── constants/            # App constants and configurations
│   ├── animations.ts     # Animation configurations
│   ├── design.ts         # Design tokens (colors, spacing)
│   └── platform.ts       # Platform-specific constants
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and helpers
│   ├── api/             # API client and endpoints
│   ├── storage/         # Local storage utilities
│   └── utils/           # General utilities
├── store/               # Zustand state management
│   ├── medicationStore.ts
│   ├── userStore.ts
│   └── reminderStore.ts
├── types/               # TypeScript type definitions
│   ├── medication.ts
│   ├── user.ts
│   └── consultation.ts
├── i18n/                # Internationalization
│   ├── locales/         # Translation files
│   │   ├── en.json
│   │   ├── am.json
│   │   ├── or.json
│   │   ├── ti.json
│   │   └── gz.json
│   └── config.ts        # i18n configuration
├── services/            # Business logic services
│   ├── medicationService.ts
│   ├── ddiService.ts
│   ├── exerciseService.ts
│   └── consultationService.ts
└── assets/              # Static assets
    ├── images/
    ├── fonts/
    └── audio/
```

## 🏗️ Architecture

### Tech Stack

- **Framework**: Expo SDK 49 with React Native 0.72
- **Navigation**: Expo Router with React Navigation
- **State Management**: Zustand
- **UI Library**: React Native Paper
- **Notifications**: Expo Notifications
- **Speech**: Expo Speech (for voice accessibility)
- **Storage**: AsyncStorage
- **Validation**: Zod
- **Language**: TypeScript

### Key Design Principles

- **Accessibility First**: Voice navigation, large touch targets, high contrast
- **Offline-First**: Core features work without internet
- **Multilingual**: Native support for 5 Ethiopian languages
- **Simple UI**: Designed for elderly and low-literacy users
- **Secure**: HIPAA-compliant data handling

## 📱 Screens

1. **Home/Dashboard**
   - Quick overview of medications
   - Today's reminders
   - Quick actions

2. **Medications**
   - Add/Edit medications
   - View interaction alerts
   - Dosing schedules

3. **Reminders**
   - Set up medication reminders
   - View adherence history
   - Refill alerts

4. **Exercise**
   - Browse exercise plans
   - Track progress
   - Safety information

5. **Diet/Nutrition**
   - Meal plans
   - Drug-nutrient interactions
   - Dietary guidelines

6. **Consultation**
   - Chat with pharmacist
   - Video calls
   - Message history

7. **Drug Locator**
   - Map view of pharmacies
   - Stock availability
   - Directions

8. **Education**
   - Educational content
   - Audio versions
   - Language selection

## 🔧 Configuration

### Supported Languages

- English (en)
- Amharic (am)
- Oromiffa (or)
- Tigrinya (ti)
- Guragigna (gz)

### Notification Permissions

The app requires notification permissions for medication reminders. These are requested on first launch.

### Location Permissions

Location permissions are required for the drug locator feature to find nearby pharmacies.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📦 Build & Deployment

### Development Build

```bash
# Create development build
eas build --profile development --platform all
```

### Production Build

```bash
# Create production build
eas build --profile production --platform all
```

### Submit to App Stores

```bash
# Submit to iOS App Store
eas submit --platform ios

# Submit to Google Play Store
eas submit --platform android
```

## 🤝 Contributing

This project is developed by a team of 3rd year pharmacy students:
- Bezawit Girma
- Bisrat Asnake
- Nesera Mekarim
- Kemeria Bedru
- Emebet Birhanu

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For technical support or questions, please contact the development team.

## 🎯 Roadmap

### Phase 1 (Current)
- Core medication management
- Basic reminders
- Multilingual support
- DDI checking

### Phase 2
- Exercise and diet modules
- Pharmacist consultation
- Drug locator
- Enhanced analytics

### Phase 3
- AI-powered recommendations
- Integration with healthcare systems
- Advanced reporting
- Telehealth features

## 🔒 Privacy & Security

- All health data is encrypted
- HIPAA-compliant data handling
- Secure authentication
- Regular security audits
- User data never shared without consent