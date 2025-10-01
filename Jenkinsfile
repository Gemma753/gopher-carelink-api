pipeline {
  agent any
  options { timestamps() }

  environment {
    // Snyk token stored in Jenkins Credentials (ID = snyk-token)
    SNYK_TOKEN = credentials('snyk-token')
  }

  stages {
    stage('Build') {
      steps {
        echo '=== Build Stage ==='
        sh 'npm ci'
        sh 'npm run build'
        archiveArtifacts artifacts: 'build/**', fingerprint: true
      }
    }

    stage('Test') {
      steps {
        echo '=== Test Stage ==='
        sh 'npm test'
      }
      post {
        always {
          junit 'reports/junit/junit.xml'
          archiveArtifacts artifacts: 'coverage/**', onlyIfSuccessful: false
        }
      }
    }

    stage('Code Quality') {
      environment {
        // Use the SonarScanner tool you configured in Jenkins Tools (name: SonarScanner)
        SCANNER_HOME = tool 'SonarScanner'
      }
      steps {
        echo '=== Code Quality Stage (SonarCloud) ==='
        withSonarQubeEnv('Sonar') {
          sh '${SCANNER_HOME}/bin/sonar-scanner'
        }
      }
    }

    stage('Security') {
      environment {
        // Use the Snyk tool you configured in Jenkins Tools (name: Snyk)
        SNYK_HOME = tool 'Snyk'
      }
      steps {
        echo '=== Security Stage (Snyk) ==='
        withCredentials([string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')]) {
          sh '${SNYK_HOME}/bin/snyk auth $SNYK_TOKEN'
          sh 'mkdir -p reports && ${SNYK_HOME}/bin/snyk test --json > reports/snyk.json || true'
          archiveArtifacts artifacts: 'reports/snyk.json', onlyIfSuccessful: false
        }
      }
    }
  }

  post {
    always {
      echo 'Pipeline finished.'
    }
  }
}