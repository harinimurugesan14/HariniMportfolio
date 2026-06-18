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

        stage('Docker Push Test') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo "Username=$DOCKER_USER"
                    echo "Password length=${#DOCKER_PASS}"
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