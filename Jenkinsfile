pipeline {
  agent any

  environment {
    // ปรับให้ Jenkins ใช้ npm cache ลดเวลาติดตั้ง
    NPM_CONFIG_CACHE = "${WORKSPACE}/.npm"
  }

  stages {

    stage('Test npm') {
      steps {
        sh 'node -v'
        sh 'npm -v'
        sh 'npm ci'
        sh 'npm test'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
        sh 'ls -la .next || true'
      }
    }

    stage('Test Build') {
      steps {
        // รัน server แล้ว curl เช็คว่าหน้าเว็บตอบได้จริง
        sh '''
          nohup npm run start > server.log 2>&1 &
          echo $! > server.pid
          sleep 3
          curl -I http://localhost:3000 | head -n 1
          curl -s http://localhost:3000 | head -n 5
          kill $(cat server.pid) || true
        '''
      }
    }

    stage('Deploy') {
      steps {
        withCredentials([
          string(credentialsId: 'VERCEL_TOKEN', variable: 'VERCEL_TOKEN'),
          string(credentialsId: 'VERCEL_ORG_ID', variable: 'VERCEL_ORG_ID'),
          string(credentialsId: 'VERCEL_PROJECT_ID', variable: 'VERCEL_PROJECT_ID')
        ]) {
          sh '''
            npx vercel --version
            npx vercel pull --yes --environment=production --token=$VERCEL_TOKEN
            npx vercel build --prod --token=$VERCEL_TOKEN
            npx vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
          '''
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'server.log', allowEmptyArchive: true
    }
  }
}
