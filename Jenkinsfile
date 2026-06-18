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
            sh 'docker push harinimurugesan14/harini-portfolio:v2'
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

