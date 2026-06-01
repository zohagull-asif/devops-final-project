pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo "Building from GitHub"
            }
        }
        stage('Build Images') {
            steps {
                dir('docker') {
                    sh 'docker compose build'
                }
            }
        }
        stage('Security Scan - Trivy') {
            steps {
                echo 'Scanning images for vulnerabilities...'
                sh 'trivy image --severity HIGH,CRITICAL --exit-code 0 --no-progress docker-backend:latest'
                sh 'trivy image --severity HIGH,CRITICAL --exit-code 0 --no-progress docker-frontend:latest'
            }
        }
        stage('Deploy') {
            steps {
                dir('docker') {
                    sh 'docker compose up -d'
                }
            }
        }
        stage('Verify') {
            steps {
                dir('docker') {
                    sh 'docker compose ps'
                }
            }
        }
        stage('Security Scan - OWASP ZAP') {
            steps {
                echo 'Running OWASP ZAP baseline scan against the running app...'
                sh 'docker run --rm --network host ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://localhost:8090 -I || true'
            }
        }
    }
    post {
        success {
            echo 'Deployed! TaskFlow is live on port 8090.'
        }
        failure {
            echo 'Pipeline failed - check the logs above.'
        }
    }
}