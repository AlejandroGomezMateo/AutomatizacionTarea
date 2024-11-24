const { Builder, By, Key, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');  
const fs = require('fs');

async function TomarCapturas() {
    let driver = await new Builder()
        .forBrowser('MicrosoftEdge')  
        .build();

    const reportContent = [];

    try {
        await driver.get('https://www.github.com');
        await takeScreenshot(driver, 'home_photo.png');
        reportContent.push('<h2>Visita a la página principal de GitHub</h2>');
        reportContent.push('<img src="home_photo.png" alt="Home Screenshot" style="width:100%; max-width:600px;">');

        let loginBtn = await driver.wait(until.elementLocated(By.linkText('Sign in')), 10000); 
        await loginBtn.click();
        //console.log('Clic en el botón "Sign in" realizado');
        
        await takeScreenshot(driver, 'login_photo.png');
        reportContent.push('<h2>Se hace clic en "Sign in"</h2>');
        reportContent.push('<img src="login_photo.png" alt="Login Screenshot" style="width:100%; max-width:600px;">');

    } catch (error) {
        console.log('Error durante la ejecución de la prueba:', error);
        reportContent.push('<h2>Error durante la ejecución</h2>');
        reportContent.push('<p>' + error.message + '</p>');
    } finally {
        await generateHTMLReport(reportContent);
        // await driver.quit();  
    }
}

async function takeScreenshot(driver, fileName) {
    await driver.takeScreenshot().then(function(image, er) {
        if (er) {
            console.log('Error al tomar la captura de pantalla:', er);
        } else {
            fs.writeFileSync(fileName, image, 'base64');
            console.log(`Captura de pantalla guardada como ${fileName}`);
        }
    });
}

// Función para generar el reporte HTML
async function generateHTMLReport(content) {
    const htmlReport = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte de Pruebas Automatizadas</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f9; color: #333; margin: 20px; }
            h1 { color: #2c3e50; }
            h2 { color: #34495e; }
            img { display: block; margin: 20px 0; }
            p { font-size: 16px; line-height: 1.5; }
        </style>
    </head>
    <body>
        <h1>Reporte de Pruebas Automatizadas</h1>
        ${content.join('')}
    </body>
    </html>
    `;

    fs.writeFileSync('reporte_pruebas.html', htmlReport);
    console.log('Reporte HTML generado como reporte_pruebas.html');
}

TomarCapturas();
