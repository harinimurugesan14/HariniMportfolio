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
                sh 'docker build -t harinimurugesan14/harini-portfolio:v2 .'
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
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker push harinimurugesan14/harini-portfolio:v2
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy Stage'
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
