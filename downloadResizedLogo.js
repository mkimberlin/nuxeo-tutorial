#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const nuxeo = require('./nuxeoConnection').nuxeoSalesManager;
const northAmericaDomain = require('./tutorialConstants').northAmericaDomain;

const filePath = './tmp/';

const portfolioToFetch = `${northAmericaDomain}/Money Bank`;
const renditionSizes = ['Thumbnail','Medium'];

let companyName, fileFormat;

nuxeo.schemas('*');
nuxeo.repository().fetch(portfolioToFetch)
    .then(portfolio => {
        companyName = portfolio.properties['dc:title'];
        console.log('The following image sizes can be downloaded:');
        portfolio.properties['picture:views'].forEach(currentPictureView => {
            console.log(currentPictureView.title);
            console.log(currentPictureView.info);
            if (renditionSizes.includes(currentPictureView.title)) {
                const renditionSize = currentPictureView.title;
                fileFormat = currentPictureView.info.format.toLowerCase();
                console.log(`We'll ask for a ${renditionSize}-sized company logo in the ${fileFormat} format.`);
                portfolio.fetchRendition(renditionSize).then(response => {
                    try {
                        const stats = fs.statSync(filePath);
                        if (!stats.isDirectory()) {
                            console.log(`${filePath} is not a folder.\nPlease check the filePath variable and make sure you have the proper rights on that folder.`);
                            return;
                        }

                        const renditionFilePath = path.join(filePath, `${companyName}-${renditionSize}.${fileFormat}`);
                        const writable = fs.createWriteStream(renditionFilePath);
                        response.body.pipe(writable);
                        console.log(`The ${renditionSize} sized company logo has been downloaded!`);
                        console.log(`You can take a look at it here: ${renditionFilePath}`);
                    } catch (error) {
                        console.log(`The folder where the rendition should be downloaded cannot be accessed.\nPlease check the filePath variable (currently set to: ${filePath})\n and make sure you have write access on that folder.`);
                        return Promise.reject(error);
                    }
                });
            }
        });
    }).catch(error => {
        console.log('Apologies, an error occurred while fetching the rendition.');
        console.log(error);
    });
