# SMART MEDICINE ROBOT (SMR-01)
## Hospital Autonomous Medicine Delivery & Monitoring System

A production-grade, presentation-ready medical robotics frontend platform engineered for autonomous hospital medication transport, real-time telemetry inspection, ESP32-CAM optical surveillance, topological navigation, and secure quad-vault payload tracking.

---

### Project Overview
The **Smart Medicine Robot (SMR-01)** is an autonomous hospital logistics carrier designed to deliver prescriptions, intravenous fluids, and critical emergency supplies between the Central Pharmacy, Nurse Stations, Intensive Care Units (ICU), Trauma Emergency Wards, and Patient Rooms.

This web application serves as the **Fleet Mission Control & Teleoperation Interface**, providing hospital administrators and charge nurses with complete real-time oversight of the autonomous vehicle.

---

### Key Capabilities & Features

1. **Authentication & Session Guard (`/login`)**:
   - Operator credentials validation (`admin` / `admin123`).
   - One-click **Quick Demo Fill** for smooth presentation and faculty evaluations.
   - Client-side session persistence via `localStorage` with route protection.

2. **Mission Command Center (`/dashboard`)**:
   - Executive Robot Overview: SMR-01 online indicator, battery %, heading, active mode.
   - **Quick Robot Controls**: Immediate dispatch actions (`START DELIVERY`, `PAUSE`, `EMERGENCY STOP`, `RETURN TO BASE`).
   - **Waypoint Destination Dispatcher**: 1-click routing to Room 101, 102, 103, ICU, ER, Pharmacy, OT.
   - **Live Telemetry Grid**: Real-time simulated readouts for Battery (%), Speed (PWM), Optical Distance (km), Collision Clearance, Motor Load, Wi-Fi Signal, Temperature, and IR Line Follower.
   - **Interactive Hospital Topological Map**: Custom SVG vector layout showing real-time robot location, active path, and waypoints.
   - **Compact ESP32-CAM Preview** with live status indicator.

3. **Robot Teleoperation Center (`/control`)**:
   - **Chassis Visualizer**: Medical robotics SVG model showcasing the 4WD differential chassis, ultrasonic transducer cones, and quad lockbox compartments.
   - **Manual Drive Pad**: Directional controls (`FORWARD`, `LEFT`, `STOP`, `RIGHT`, `REVERSE`).
   - **Speed Governor Slider**: Dynamic 0–100% PWM speed adjustment.
   - **Prominent Emergency STOP Button**.
   - **Motor Diagnostics**: Real-time H-Bridge Channel A and Channel B speeds, RPM, and current draw.
   - **Sensor Array Visualizer**: Front, Left, and Right HC-SR04 ultrasonic distance gauges + 4-channel TCRT5000 IR line follower status.

4. **ESP32-CAM Surveillance Room (`/camera`)**:
   - Full-screen medical surveillance HUD with crosshairs, timestamp, FPS meter, and resolution selector (`SVGA`, `VGA`, `QVGA`, `UXGA`).
   - **Snapshot Tool**: Captures frames with metadata and stores them in the local telemetry archive.
   - **Pan-Tilt Control**: Simulates SG90 micro-servo camera angle (30° to 150°).
   - **Flash LED Illuminator** & **Night Vision IR Spectral Filter** toggles.
   - **Hardware Stream Config**: Modal to link a physical ESP32-CAM MJPEG endpoint (`http://<ESP32_IP>:81/stream`).

5. **Hospital Route Directory (`/routes`)**:
   - Complete topological catalog of Floor 2 medical corridors and waypoints.
   - Distance (meters), transit time (minutes/seconds), junction node count, and corridor status (`Clear`, `Busy`, `Caution`).
   - Route detail modal with step-by-step turn waypoints and direct dispatch action.

6. **Medicine Delivery Ledger (`/deliveries`)**:
   - Comprehensive hospital prescription records (`DEL-001`, `DEL-002`, `DEL-003`, etc.).
   - Multi-field search (ID, medicine, patient name, bed, ward).
   - Filters for status (`In Progress`, `Delivered`, `Pending`, `Cancelled`) and destination.
   - Delivery Dossier detail modal with compartment lock verification and status progression actions.
   - **New Delivery Modal**: Create and queue new medication payloads into bays 1–4.

7. **Hardware Subsystem Health (`/system`)**:
   - 16-subsystem telemetry matrix monitoring:
     - ESP32 Dual-Core MCU (240 MHz, FreeRTOS heap)
     - ESP32-CAM OV2640 module
     - L298N Dual H-Bridge motor driver
     - 4x DC geared motors (Front-Left, Front-Right, Rear-Left, Rear-Right)
     - 3x HC-SR04 ultrasonic collision sensors (Front, Left, Right)
     - 4-channel TCRT5000 IR line follower
     - SG90 pan-tilt camera servo
     - 0.96" SSD1306 OLED display
     - DFPlayer Mini MP3 audio module
     - 12V 3S Li-ion battery pack with BMS
     - 802.11 b/g/n hospital Wi-Fi link
   - **Subsystem Self-Test Action**: Simulates a 16-point hardware diagnostic test and updates system health scores.

8. **System & Fleet Configuration (`/settings`)**:
   - Robot identifier and name.
   - Hospital name and location.
   - Navigation defaults (speed governor, obstacle threshold in cm, auto-return).
   - Alert toggles (deliveries, obstacles, low battery) and DFPlayer synthesized voice announcements.
   - Theme and live telemetry simulation loop controls.
   - Persisted directly to `localStorage`.

---

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict typing)
- **Styling**: Tailwind CSS v4 & custom design tokens
- **Icons**: Lucide React
- **Audio Synthesis**: Web Speech API + Web Audio API oscillator synthesizers (simulating DFPlayer Mini hardware)
- **State Management**: React Context (`RobotProvider`) with `localStorage` persistence

---

### Getting Started

#### Prerequisites
- Node.js 18+ or 20+ installed
- npm or yarn

#### Installation & Development
```bash
# Navigate to the project directory
cd smart-medicine-robot

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

### Demo Credentials
To log in to the Mission Command Center:

- **Username**: `admin`
- **Password**: `admin123`

*(You can also click the **Fill Evaluation Credentials** button on the login screen for instant credential autofill.)*

---

### Architecture & Project Structure
```
smart-medicine-robot/
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── layout.tsx           # Global HTML layout with RobotProvider
│   │   ├── globals.css          # Design tokens, medical dark palette, scanlines
│   │   ├── page.tsx             # Root auth redirector
│   │   ├── login/page.tsx       # Operator authentication portal
│   │   ├── dashboard/page.tsx   # Mission command center overview
│   │   ├── control/page.tsx     # Robot manual teleoperation center
│   │   ├── camera/page.tsx      # ESP32-CAM surveillance control room
│   │   ├── routes/page.tsx      # Topological floor map & route catalog
│   │   ├── deliveries/page.tsx  # Medication delivery ledger & dispatch
│   │   ├── system/page.tsx      # 16-point hardware health & diagnostics
│   │   └── settings/page.tsx    # Configuration & parameter governor
│   ├── components/
│   │   ├── layout/              # AppShell, Sidebar, TopNavbar, MobileNav, ToastContainer
│   │   ├── ui/                  # Badge, Button, Card, Modal, StatGauge
│   │   ├── robot/               # RobotVisual, QuickControlBar, DestinationSelector, TelemetryGrid, ManualDrivePad, SensorReadout
│   │   ├── camera/              # Esp32CamView, SnapshotGalleryModal, StreamConfigModal
│   │   ├── routes/              # HospitalMapSvg, RouteList, RouteDetailModal
│   │   ├── deliveries/          # DeliveryTable, DeliveryDetailModal, NewDeliveryModal
│   │   ├── system/              # SystemHealthGrid
│   │   └── dashboard/           # HeroRobotStatus, ActiveMissionCard, RecentActivityFeed
│   ├── lib/
│   │   ├── auth.ts              # Authentication helpers & session storage
│   │   ├── mock-data.ts         # Initial mock datasets (routes, deliveries, hardware)
│   │   ├── robot-context.tsx    # Master state manager & telemetry simulation loop
│   │   ├── speech.ts            # DFPlayer voice announcements synthesizer
│   │   └── utils.ts             # Styling & formatting helpers
│   └── types/
│       ├── robot.ts             # Telemetry, sensor, and motor types
│       ├── delivery.ts          # Delivery records, statuses, and compartments
│       ├── route.ts             # Routes, waypoints, and topology types
│       └── system.ts            # Hardware modules and diagnostic summaries
├── public/                      # Static assets
├── package.json
└── README.md
```

---

### Future Hardware & Backend Integration Roadmap

While this project is fully functional as a frontend-only application with realistic simulated telemetry, the architecture has been intentionally decoupled so you can connect physical robot hardware:

#### 1. Future Communication Topology
```
           +-----------------------------+
           |     Next.js Web Frontend    |
           |      (Mission Control)      |
           +--------------+--------------+
                          |
             HTTP REST / WebSocket / MQTT
                          |
                          v
           +-----------------------------+
           |      ESP32 Microcontroller  |
           |   (FreeRTOS Telemetry Bus)  |
           +-------+---------------+-----+
                   |               |
     +-------------+--+      +-----+-----------+
     | L298N Motors   |      | Sensor Bus      |
     | 4WD DC Geared  |      | 3x HC-SR04      |
     | SG90 Servo     |      | 4-Ch TCRT5000   |
     +----------------+      | DFPlayer + OLED |
                             +-----------------+

           +-----------------------------+
           |          ESP32-CAM          |
           | (OV2640 MJPEG Stream Server)|
           +--------------+--------------+
                          |
                  HTTP /port 81 Stream
                          |
                          v
           +-----------------------------+
           |   <img src=".../stream">    |
           |     in Esp32CamView.tsx     |
           +-----------------------------+
```

#### 2. Physical ESP32 Microcontroller Integration
1. **MQTT / WebSockets**:
   In `src/lib/robot-context.tsx`, replace the `setInterval` simulation loop with an MQTT client (using `mqtt.js`) or WebSocket listener:
   ```typescript
   const ws = new WebSocket('ws://192.168.1.150:8080');
   ws.onmessage = (event) => {
     const data = JSON.parse(event.data);
     setTelemetry(data);
   };
   ```
2. **Sending Motor Commands**:
   Map `setManualDrive(direction)` and `setSpeed(speed)` in `robot-context.tsx` to publish MQTT messages or send `POST /api/robot/drive`:
   ```typescript
   fetch('http://192.168.1.150/api/drive', {
     method: 'POST',
     body: JSON.stringify({ direction, speed }),
   });
   ```

#### 3. Physical ESP32-CAM Video Stream Integration
1. Run the standard Arduino IDE **CameraWebServer** example on your ESP32-CAM board.
2. In the Camera page, click the **Settings icon** and input your camera IP:
   `http://192.168.1.150:81/stream`.
3. In `src/components/camera/Esp32CamView.tsx`, you can replace the SVG corridor canvas with a standard HTML `<img>` tag pointing to `settings.streamUrl`.

#### 4. Backend Database Migration
When adding a real database (e.g. PostgreSQL / Supabase / MongoDB):
- Replace `localStorage` calls in `auth.ts` and `robot-context.tsx` with standard Next.js Server Actions or API routes under `src/app/api/`.

---

### Verification & Testing
To run a clean production build check:
```bash
npm run build
```
All routes (`/login`, `/dashboard`, `/control`, `/camera`, `/routes`, `/deliveries`, `/system`, `/settings`) are fully statically typed and error-free.

---

### Project Credits
**Final-Year Engineering Capstone Project**  
*SMART MEDICINE ROBOT — Hospital Autonomous Medicine Delivery System*
