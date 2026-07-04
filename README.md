# Tourism Information Website - DevOps Pipeline & Monitoring

This project contains a complete DevOps implementation for Use Case 5 (Tourism Information Website). It includes a high-fidelity static website, containerization, orchestration manifests, a CI/CD pipeline, and a local monitoring/logging stack.

---

## Port Configuration Summary

| Service | Port | Description | Credentials |
| :--- | :--- | :--- | :--- |
| **Website** | `30080` (NodePort) / `8085` (Local) | Static Website | N/A |
| **Jenkins** | `8080` | Build Automation / Pipeline | Initial admin password printed in docker logs |
| **Nagios** | `8081` | Availability Checker | User: `nagiosadmin` / Password: `nagios` |
| **Graphite** | `8082` | Metrics Database (Carbon receives on `2003`) | N/A |
| **Grafana** | `3000` | Metric Visualizations | User: `admin` / Password: `admin` |

---

## Step-by-Step Setup Guide

### 1. Launch the DevOps Infrastructure Stack
Start Jenkins, Nagios, Graphite, and Grafana containers:
```bash
# Navigate to the monitoring directory
cd monitoring

# Start the stack
docker compose up -d
```
Verify all containers are active:
```bash
docker compose ps
```

### 2. Host the Website Container Locally
To build and test the website container image locally without Kubernetes:
```bash
# Build the Docker image
docker build -t tourism-website:latest .

# Run the container
docker run -d -p 8085:80 --name tourism-web-local tourism-website:latest
```
Open your browser and navigate to `http://localhost:8085` to review.

### 3. Deploy to Kubernetes
To deploy the application container onto a local Kubernetes cluster (like Minikube, Docker Desktop Kubernetes, or MicroK8s):
```bash
# Apply deployment configuration
kubectl apply -f k8s/deployment.yaml

# Apply Service NodePort configuration
kubectl apply -f k8s/service.yaml
```
Verify pods and service statuses:
```bash
kubectl get pods -l app=tourism-website
kubectl get service tourism-website-service
```
Access the website in the browser at: `http://localhost:30080` or `http://<minikube-ip>:30080`.

### 4. Enable Metrics Transmission
The python reporter sends CPU, memory, network, and uptime metrics to Graphite Carbon (port 2003). Run it on your host machine:
```bash
# Install psutil and start gathering metrics
python monitoring/metrics_reporter.py
```
You should see messages stating `Metrics sent successfully.` every 5 seconds.

### 5. Access Monitoring Dashboards

#### Nagios (Availability)
- Navigate to `http://localhost:8081`
- Enter credentials: `nagiosadmin` / `nagios`
- Click **Hosts** or **Services** in the left panel to verify that `tourism-website` is `UP` and the `HTTP Availability` check shows `OK`.

#### Graphite (Metrics Store)
- Navigate to `http://localhost:8082`
- Verify the metric tree on the left displays path `system -> cpu -> usage`, etc.

#### Grafana (Visualization)
- Navigate to `http://localhost:3000`
- Log in with `admin` / `admin` (skip password change prompt).
- **Add Graphite Data Source**:
  - Go to **Connections** -> **Data Sources** -> **Add new data source**.
  - Search for **Graphite**.
  - Set URL to: `http://devops_graphite` (or `http://localhost:8082` depending on network resolution).
  - Set Name/UID to `graphite-ds`. Save & test.
- **Import Dashboard**:
  - Go to **Dashboards** -> **New** -> **Import**.
  - Copy and paste the contents of `monitoring/grafana/dashboard.json` or upload the file.
  - Choose the Graphite data source and click **Import**.
  - You will see real-time charts displaying CPU, memory usage, network, and uptime.
