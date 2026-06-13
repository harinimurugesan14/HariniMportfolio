pipeline {
    agent any

    stages {

        stage('Build') {
            steps {
                echo 'Building Portfolio Project'
            }
        }

        stage('Test') {
            steps {
                echo 'Testing Portfolio Project'
            }
        }
    }

    post {
        always {
            echo 'Pipeline Finished'
        }
    }
}
