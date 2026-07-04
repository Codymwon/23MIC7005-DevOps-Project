pipeline {
    agent any

    environment {
        DOCKER_REGISTRY_USER = 'aadiii9'
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
                // Force remove any leftover test container
                sh 'docker rm -f test-web-container || true'
                script {
                    // Dynamically detect the network name of this Jenkins container using json output and cut
                    def jenkinsNet = sh(script: "docker inspect -f '{{json .NetworkSettings.Networks}}' \$(cat /etc/hostname) | cut -d'\"' -f2", returnStdout: true).trim()
                    echo "Jenkins container network detected: ${jenkinsNet}"
                    
                    // Run test container on the same network to enable DNS resolution
                    sh "docker run -d --name test-web-container --network ${jenkinsNet} ${DOCKER_REGISTRY_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                }
                sleep 3
                script {
                    try {
                        // Query the container by its DNS name directly
                        sh "curl -sI http://test-web-container | grep 'HTTP/1.1 200 OK'"
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
                script {
                    try {
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                            sh "docker push ${DOCKER_REGISTRY_USER}/${IMAGE_NAME}:${IMAGE_TAG}"
                            sh "docker push ${DOCKER_REGISTRY_USER}/${IMAGE_NAME}:latest"
                        }
                    } catch (Exception e) {
                        echo "Docker Hub credentials not configured. Skipping image push step..."
                    }
                }
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                echo 'Deploying to Kubernetes cluster...'
                script {
                    sh '''
                        if [ -f /root/.kube/config ]; then
                            echo "Detected mounted kubeconfig. Patching host endpoint..."
                            mkdir -p tmp_k8s
                            cat /root/.kube/config | sed 's/127.0.0.1/host.docker.internal/g' | sed 's/localhost/host.docker.internal/g' > tmp_k8s/kubeconfig
                            kubectl apply -f k8s/deployment.yaml --kubeconfig=tmp_k8s/kubeconfig
                            kubectl apply -f k8s/service.yaml --kubeconfig=tmp_k8s/kubeconfig
                            echo 'Deployment successful! Checking rollouts...'
                            kubectl rollout status deployment/tourism-website-deployment --timeout=60s --kubeconfig=tmp_k8s/kubeconfig
                            rm -rf tmp_k8s
                        else
                            echo "No mounted kubeconfig found at /root/.kube/config. Trying fallback..."
                            kubectl apply -f k8s/deployment.yaml
                            kubectl apply -f k8s/service.yaml
                            echo 'Deployment successful! Checking rollouts...'
                            kubectl rollout status deployment/tourism-website-deployment --timeout=60s
                        fi
                    '''
                }
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
