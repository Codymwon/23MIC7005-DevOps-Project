pipeline {
    agent any

    environment {
        DOCKER_REGISTRY_USER = 'your_dockerhub_username'
        IMAGE_NAME           = 'tourism-website'
        IMAGE_TAG            = "${BUILD_NUMBER}"
        KUBECONFIG_CRED      = 'kubeconfig-credentials-id'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Lint & Validate') {
            steps {
                echo 'Validating HTML static files structure...'
                // Simple validation to ensure pages exist
                sh 'test -f public/index.html && test -f public/attractions.html'
                sh 'test -f public/hotels.html && test -f public/guide.html'
                sh 'test -f public/map.html && test -f public/booking.html'
                echo 'Static assets validated successfully!'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker Image...'
                sh "docker build -t ${DOCKER_REGISTRY_USER}/${IMAGE_NAME}:${IMAGE_TAG} ."
                sh "docker tag ${DOCKER_REGISTRY_USER}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_REGISTRY_USER}/${IMAGE_NAME}:latest"
            }
        }

        stage('Docker Test') {
            steps {
                echo 'Running Container Test...'
                // Run container temporarily
                sh "docker run -d -p 8085:80 --name test-web-container ${DOCKER_REGISTRY_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                
                // Sleep to allow container to start
                sleep 3
                
                // Verify endpoint responds
                script {
                    try {
                        sh "curl -sI http://localhost:8085 | grep 'HTTP/1.1 200 OK'"
                        echo 'Test Passed: Website is reachable and serves HTTP 200 OK!'
                    } finally {
                        echo 'Stopping and removing test container...'
                        sh 'docker stop test-web-container && docker rm test-web-container'
                    }
                }
            }
        }

        stage('Docker Push (Optional)') {
            steps {
                echo 'Pushing Docker Image to Docker Hub...'
                // If credentials are configured, we login and push
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                        sh "docker push ${DOCKER_REGISTRY_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_REGISTRY_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                echo 'Deploying to Kubernetes cluster...'
                // Apply the deployment and service manifests
                // We use kubeconfig credentials if available, otherwise fallback to local context
                script {
                    try {
                        configFileProvider([configFile(fileId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                            sh 'kubectl apply -f k8s/deployment.yaml --kubeconfig=$KUBECONFIG'
                            sh 'kubectl apply -f k8s/service.yaml --kubeconfig=$KUBECONFIG'
                        }
                    } catch (Exception e) {
                        echo "Failed using configFileProvider, falling back to host's kubectl context..."
                        sh 'kubectl apply -f k8s/deployment.yaml'
                        sh 'kubectl apply -f k8s/service.yaml'
                    }
                }
                echo 'Deployment successful! Checking rollouts...'
                sh 'kubectl rollout status deployment/tourism-website-deployment --timeout=60s'
            }
        }
    }

    post {
        success {
            echo 'DevOps Pipeline Executed Successfully! Website is running on NodePort 30080.'
        }
        failure {
            echo 'Pipeline failed. Check stage logs for errors.'
        }
    }
}
