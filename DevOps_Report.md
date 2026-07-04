# DEVOPS ASSIGNMENT - 2
## USE CASE 5: TOURISM INFORMATION WEBSITE

**Student Details:**
- **Name:** Aadith M Mathew
- **Register Number:** 23MIC7005

---

### Mandatory Submission Links (First Page)

| 1 | GitHub Repository Link | [https://github.com/Codymwon/23MIC7005-DevOps-Project](https://github.com/Codymwon/23MIC7005-DevOps-Project) |
| 2 | Jenkins Build URL | [http://localhost:8080/job/tourism-pipeline](http://localhost:8080/job/tourism-pipeline) |
| 3 | Docker Hub Repository Link | [https://hub.docker.com/r/aadiii9/tourism-website](https://hub.docker.com/r/aadiii9/tourism-website) |
| 4 | Application URL | [http://localhost:30080](http://localhost:30080) |
| 5 | Grafana Dashboard Screenshot | ![Grafana Dashboard](screenshots/Screenshot%202026-07-04%20214253.png) |
| 6 | Nagios Monitoring Screenshot | ![Nagios Dashboard](screenshots/Screenshot%202026-07-04%20215249.png) |
| 7 | Graphite Metrics Screenshot | ![Graphite Metrics](screenshots/Screenshot%202026-07-04%20212218.png) |

---

## 1. Jenkins Automation Screenshots
*URL/Screenshots showing Jenkins Dashboard, Job Configuration, Console Output, and Successful Build.*

![Jenkins Job Configuration](screenshots/Screenshot%202026-07-04%20211449.png)
### ![Jenkins Pipeline Stage View (Successful Build)](screenshots/Screenshot%202026-07-04%20211548.png)
### ![Jenkins Build Console Output](screenshots/Screenshot%202026-07-04%20211603.png)

---

## 2. Docker Build and Running Container Screenshots
*Screenshots showing the Docker image build process and the container running on the system.*

![Docker Image Build Process](screenshots/Screenshot%202026-07-04%20194903.png)
### ![Docker Container Running](screenshots/Screenshot%202026-07-04%20194533.png)

---

## 3. Kubernetes Deployment Screenshots
*Screenshots showing deployment of website on Kubernetes cluster.*

![Kubernetes Pods and Services in Running State](screenshots/Screenshot%202026-07-04%20215307.png)

---

## 4. Nagios Monitoring Screenshots
*Screenshots showing the monitored host and HTTP service in the UP/OK state.*

![Nagios Host State (UP)](screenshots/Screenshot%202026-07-04%20215249.png)
### ![Nagios Services State (OK)](screenshots/Screenshot%202026-07-04%20215249.png)

---

## 5. Graphite Metrics Screenshots
*Screenshots showing application/system metrics being received in Graphite.*

![Graphite Metrics Tree displaying received metrics](screenshots/Screenshot%202026-07-04%20212218.png)

---

## 6. Grafana Dashboard Screenshots
*Screenshots of the Grafana dashboard displaying monitored metrics (CPU, Memory, Network, Uptime).*

![Grafana Dashboard displaying CPU, Memory, Network, and Uptime](screenshots/Screenshot%202026-07-04%20214253.png)

---

## 7. Application Output Screenshots
*Screenshots showing the website pages accessible in the web browser.*

![Homepage (index.html)](screenshots/Screenshot%202026-07-04%20201451.png)
### ![Attractions Page (attractions.html)](screenshots/Screenshot%202026-07-04%20201504.png)
### ![Booking Page with Live Price Calculator (booking.html)](screenshots/Screenshot%202026-07-04%20201514.png)

---

## 8. Step-by-Step Implementation Screenshots
*Screenshots showing terminal commands or configuration actions performed during setup.*

![Running Docker Compose Stack](screenshots/Screenshot%202026-07-04%20194533.png)
### ![Executing Kubernetes Deployment Commands](screenshots/Screenshot%202026-07-04%20215307.png)
### ![Running metrics_reporter.py Script](screenshots/Screenshot%202026-07-04%20195940.png)
