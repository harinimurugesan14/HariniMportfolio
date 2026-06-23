pipeline {
agent any


stages {

    stage('Build') {
        steps {
            echo 'Building Portfolio'
            sh 'ls'
        }
    }

    stage('Docker Build') {
        steps {
            sh "docker build -t harinimurugesan14/harini-portfolio:v${BUILD_NUMBER} ."
        }
    }

    stage('Docker Images') {
        steps {
            sh 'docker images'
        }
    }

    stage('Docker Push') {
        steps {
            withCredentials([usernamePassword(
                credentialsId: 'dockerhub-creds',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_PASS'
            )]) {
                sh '''
                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                docker push harinimurugesan14/harini-portfolio:v${BUILD_NUMBER}
                '''
            }
        }
    }

    stage('Deploy') {
        steps {
            sh """
            export KUBECONFIG=/root/.kube/config

            kubectl get nodes

            kubectl set image deployment/portfolio-deployment \
            portfolio-container=harinimurugesan14/harini-portfolio:v${BUILD_NUMBER}

            kubectl rollout status deployment/portfolio-deployment
            """
        }
    }
}

post {
    always {
        echo 'Pipeline Finished'
    }

    success {
        echo 'Build Successful'
    }

    failure {
        echo 'Build Failed'
    }
}


}

