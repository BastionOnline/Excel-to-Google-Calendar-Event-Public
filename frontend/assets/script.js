document.addEventListener("DOMContentLoaded", async () => {
    const uploadExcelFileBtn = document.getElementById("uploadExcelFileBtn");
    const sheetNameSelector = document.getElementById("sheetNameSelector");
    const headerInputSelector = document.getElementById("headerInputSelector");
    const subjectSelector = document.getElementById("subjectSelector");
    const eventStartDateSelector = document.getElementById("eventStartDateSelector");
    const eventStartTimeSelector = document.getElementById("eventStartTimeSelector");
    const eventEndDateSelector = document.getElementById("eventEndDateSelector");
    const eventEndTimeSelector = document.getElementById("eventEndTimeSelector");
    const desSel1 = document.getElementById("desSel1");
    const desSel2 = document.getElementById("desSel2");
    const desSel3 = document.getElementById("desSel3");
    const desSel4 = document.getElementById("desSel4");
    const desSel5 = document.getElementById("desSel5");
    const locSel = document.getElementById("locSel");
    const privateSel = document.getElementById("privateSel");
    const allDaySel = document.getElementById("allDaySel")
    const startBtn = document.getElementById("start");
    const eventsFoundElement = document.getElementById("eventsFoundElement")
    const getHeadersBtn = document.getElementById("getHeadersBtn")
    const openBtn = document.getElementById("openBtn")
    const fileSelected = document.getElementById("fileSelected");
    const saveProfileBtn = document.getElementById("saveProfileBtn")
    const newProfileName = document.getElementById("newProfileName")
    const profileSelector = document.getElementById("profileSelector")
    const deleteProfileBtn = document.getElementById("deleteProfileBtn")
    const clearAllBtn = document.getElementById("clearAllBtn")

    // put starting option as select xyz

    function blankOption(selector){
        console.log("making blank for selector:")
        console.log(selector)
        const blankOption = document.createElement("option");
        blankOption.value = "";
        blankOption.textContent = "None";
        selector.appendChild(blankOption);
    }

    function settingsChange(){
        // const newValue = "cherry";

        // if (!Array.from(select.options).some(option => option.value === newValue)) {
        // const newOption = new Option("Cherry", newValue);
        // select.add(newOption);
        // }

        newProfileName.placeholder = "Save New Setting..."

        // const newValue = "New Settings...";

        // if (!Array.from(profileSelector.options).some(option => option.value === newValue)) {
        //     console.log("Settings changed")

        //     const newOption = new Option("New Settings...", newValue);
        //     profileSelector.add(newOption, 0);
        // }
    }

    function loadOptions(list, selector, topListItem=null){

        // include none option

        selector.innerHTML = ""; // removes all existing options

        // Handle the optional topListItem
        if (topListItem !== null && list.includes(topListItem)) {
        // 1. Create and add the special item to the top
            const topOption = document.createElement("option");
            topOption.value = topListItem;
            topOption.textContent = topListItem;
            selector.appendChild(topOption);
            list = list.filter(item => item !== topListItem);
        }
      
        list.forEach(item => {
            // alert(item)
            const option = document.createElement("option")
            option.value = item
            option.textContent = item
            selector.appendChild(option)
        })

        blankOption(selector)

    // const blankOption = document.createElement("option");
    // blankOption.value = "";
    // blankOption.textContent = "None";
    // selector.appendChild(blankOption);

    }

    uploadExcelFileBtn.addEventListener("click", async () => {
        try {
            // alert("click")
            const excelData = await window.pywebview.api.selectExcelFile()
            const excelSheets = JSON.parse(excelData.sheets)
            const excelFilePath = excelData.path

            loadOptions(excelSheets, sheetNameSelector)
            fileSelected.innerHTML = excelFilePath;
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
       
    }
    )

    startBtn.addEventListener("click", async () => {
        try {
            // alert("start clicked")
            const eventsFoundResponse = await window.pywebview.api.startCalendar()
            alert(eventsFoundResponse)
            eventsFoundElement.innerHTML = `${eventsFoundResponse.found} found`
            // openBtn
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })


    openBtn.addEventListener("click", async () => {
        await window.pywebview.api.openCsvFolder()

    })

    saveProfileBtn.addEventListener("click", async () => {
        // get all buttons and name value to save it 
        const profValue = newProfileName.value

        if (newProfileName.value != ""){
            // copies existing config to new file
            const profileList = await window.pywebview.api.saveProfile(profValue)
            console.log(profileList)
            loadOptions(profileList, profileSelector, profValue)

            newProfileName.value = "";
        }
    })

    deleteProfileBtn.addEventListener("click", async () => {
        const profileSelectorValue = profileSelector.value
        if (profileSelectorValue != ""){
            await window.pywebview.api.deleteProfile(profileSelectorValue)
            const profileList = await window.pywebview.api.loadProfiles()
            loadOptions(profileList, profileSelector)
        }
        
    })

    function initConfig(selector, jsonValue, fill=null){
        selector.innerHTML = ""; // removes all existing options

        if (fill == true){
            const option = document.createElement("option")
            option.value = jsonValue
            option.textContent = jsonValue
            selector.appendChild(option)
            blankOption(selector)
        }
    }


    clearAllBtn.addEventListener("click", async () => {
        const pyUserData = await window.pywebview.api.clearAll()
        console.log(pyUserData)
        console.log(pyUserData["Sheet Name"])
        
        initConfig(sheetNameSelector, pyUserData["Sheet Name"])
        initConfig(headerInputSelector, pyUserData["Header Row Number"])
        initConfig(subjectSelector, pyUserData["Subject"])
        initConfig(eventStartDateSelector, pyUserData["Start Date"])
        initConfig(eventStartTimeSelector, pyUserData["Start Time"])
        initConfig(eventEndDateSelector, pyUserData["End Date"])
        initConfig(eventEndTimeSelector, pyUserData["End Time"])
        initConfig(desSel1, pyUserData["Description1"])
        initConfig(desSel2, pyUserData["Description2"])
        initConfig(desSel3, pyUserData["Description3"])
        initConfig(desSel4, pyUserData["Description4"])
        initConfig(desSel5, pyUserData["Description5"])
        initConfig(locSel, pyUserData["Location"])
        initConfig(privateSel, pyUserData["Private"])
        initConfig(allDaySel, pyUserData["All Day Event"])
        
        settingsChange()
    })

    profileSelector.addEventListener("change", async() => {
        const profileSelectorValue = profileSelector.value

        if (profileSelectorValue != ""){
            alert(profileSelector.value)

            profileConfig = await window.pywebview.api.profileSelect(profileSelector.value)
            alert(profileConfig)

            // profileConfigParsed = JSON.parse(profileConfig)
            // alert(profileConfigParsed)
            
            console.log(profileConfig)
            // check()
            // clear all button
            // function initConfig(selector, jsonValue, blank=null){
            //     selector.innerHTML = ""; // removes all existing options

            //     if (fill == true){
            //         const option = document.createElement("option")
            //         option.value = item
            //         option.textContent = item
            //         selector.appendChild(option)
            //         blankOption(selector)
            //     }
                    
            // }
            
            initConfig(sheetNameSelector, profileConfig["Sheet Name"], true)
            initConfig(headerInputSelector, profileConfig["Header Row Number"], true)
            initConfig(subjectSelector, profileConfig["Subject"], true)
            initConfig(eventStartDateSelector, profileConfig["Start Date"], true)
            initConfig(eventStartTimeSelector, profileConfig["Start Time"], true)
            initConfig(eventEndDateSelector, profileConfig["End Date"], true)
            initConfig(eventEndTimeSelector, profileConfig["End Time"], true)
            initConfig(desSel1, profileConfig["Description1"], true)
            initConfig(desSel2, profileConfig["Description2"], true)
            initConfig(desSel3, profileConfig["Description3"], true)
            initConfig(desSel4, profileConfig["Description4"], true)
            initConfig(desSel5, profileConfig["Description5"], true)
            initConfig(locSel, profileConfig["Location"], true)
            initConfig(privateSel, profileConfig["Private"], true)
            initConfig(allDaySel, profileConfig["All Day Event"], true)
            
            // settingsChange()
            // sheetNameSelector.value = profileConfig["Sheet Name"]
            // headerInputSelector.value = profileConfig["Header Row Number"]
            // subjectSelector.value = profileConfig["Subject"]
            // eventStartDateSelector.value = profileConfig["Start Date"]
            // eventStartTimeSelector.value = profileConfig["Start Time"]
            // eventEndDateSelector.value = profileConfig["End Date"]
            // eventEndTimeSelector.value = profileConfig["End Time"]
            // desSel1.value = profileConfig["Description1"]
            // desSel2.value = profileConfig["Description2"]
            // desSel3.value = profileConfig["Description3"]
            // desSel4.value = profileConfig["Description4"]
            // desSel5.value = profileConfig["Description5"]
            // locSel.value = profileConfig["Location"]
            // privateSel.value = profileConfig["Private"]
            // allDaySel.value = profileConfig["All Day Event"]
        }
    })

    sheetNameSelector.addEventListener("change", async () => {
        try {
            // alert(sheetNameSelector.value)
            const sheetNameSelected = await window.pywebview.api.selectSheetName(sheetNameSelector.value)
            // alert(sheetNameSelected)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })

    const selectors = [
        subjectSelector,
        eventStartDateSelector,
        eventStartTimeSelector,
        eventEndDateSelector,
        eventEndTimeSelector,
        desSel1,
        desSel2,
        desSel3,
        desSel4,
        desSel5,
        locSel,
        privateSel,
        allDaySel
    ];


    // headerInputSelector.addEventListener("change", async () => {
    getHeadersBtn.addEventListener("click", async () => {
        // alert("change detected!")
        try{
            console.log("Header row changed")
            
            headerInputValue = headerInputSelector.value
            console.log(headerInputValue)

            // Find the headers using the current sheet value and the header row value
            const headerJson = await window.pywebview.api.selectHeaderInput(headerInputValue, sheetNameSelector.value)
            console.log(headerJson)
            // (headerJson)

            // clear all options first
            selectors.forEach(selector => {
                selector.innerHTML = ""; // removes all existing options
            })
            
            // load headers with options
            headerJson.forEach(header => {
                console.log(header)
                
                // selector.innerHTML = ""; // removes all existing options
            
                console.log("these are the selectors")
                console.log(selectors)
                // loadOptions(selectors, selector, header)
    
                selectors.forEach( selector => {
                // alert(`selector is ${selector}`)
                    console.log(selector)
                    const option = document.createElement("option");
                    option.value = header;
                    option.innerHTML = header;
                    selector.appendChild(option);

                    // selectors.forEach( selector => {
                // // alert(`selector is ${selector}`)
                //     if (currentSelector < selectors.length){
                //         console.log(selector)
                //         const option = document.createElement("option");
                //         option.value = header;
                //         option.innerHTML = header;
                //         selector.appendChild(option);
                //         currentSelector++
                //         console.log(currentSelector)
                //     } else {
                //         const option = document.createElement("option");
                //         option.value = header;
                //         option.innerHTML = header;
                //         selector.appendChild(option);
                //         // blankOption(selector);
                //         const blankOption = document.createElement("option");
                //         blankOption.value = "";
                //         blankOption.innerHTML = "None";
                //         selector.appendChild(blankOption);
                //     }
                });
                            
                // add blank option at the bottom
                // blankOption(selectors);
                
            })
            
            // add empty option last
            selectors.forEach(selector =>
                blankOption(selector)
            )

            settingsChange()

        } catch (err) {
            selectors.forEach(selector => {
                selector.innerHTML = ""
            })
            console.log(err)
            alert(`Headings Not Found`);
        }
    })

    subjectSelector.addEventListener("change", async () => {
        try {
            const eventName = await window.pywebview.api.selectEventNameInput(subjectSelector.value)
            // alert(eventName)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })

    eventStartDateSelector.addEventListener("change", async () => {
        try {
            const eventStartDate = await window.pywebview.api.selectEventStartDateInput(eventStartDateSelector.value)
            // alert(eventStartDate)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })

    eventStartTimeSelector.addEventListener("change", async () => {
        try {
            const eventStartTime = await window.pywebview.api.selectEventStartTimeInput(eventStartTimeSelector.value)
            // alert(eventStartTime)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })

    eventEndDateSelector.addEventListener("change", async () => {
        try {
            const eventEndDate = await window.pywebview.api.selectEventEndDateInput(eventEndDateSelector.value)
            // alert(eventEndDate)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })

    eventEndTimeSelector.addEventListener("change", async () => {
        try {
            const eventEndTime = await window.pywebview.api.selectEventEndTimeInput(eventEndTimeSelector.value)
            // alert(eventEndTime)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })

    desSel1.addEventListener("change", async () => {
        try {
            const eventDescription = await window.pywebview.api.selectEventDescription1(desSel1.value)
            // alert(eventDescription)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })

    desSel2.addEventListener("change", async () => {
        try {
            const eventDescription = await window.pywebview.api.selectEventDescription2(desSel2.value)
            // alert(eventDescription)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })

    desSel3.addEventListener("change", async () => {
        try {
            const eventDescription = await window.pywebview.api.selectEventDescription3(desSel3.value)
            // alert(eventDescription)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })

    desSel4.addEventListener("change", async () => {
        try {
            const eventDescription = await window.pywebview.api.selectEventDescription4(desSel4.value)
            // alert(eventDescription)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })

    desSel5.addEventListener("change", async () => {
        try {
            const eventDescription = await window.pywebview.api.selectEventDescription5(desSel5.value)
            // alert(eventDescription)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })


    locSel.addEventListener("change", async () => {
        try {
            alert(locSel.value)
            const pyLocSel = await window.pywebview.api.selectLocSel(locSel.value)
            // alert(eventDescription)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })

    privateSel.addEventListener("change", async () => {
        try {
            const pyPrivateSel = await window.pywebview.api.selectPrivateSel(privateSel.value)
            // alert(eventDescription)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })

    allDaySel.addEventListener("change", async () => {
        try {
            const pyAllDaySel = await window.pywebview.api.selectAllDaySel(allDaySel.value)
            // alert(eventDescription)
            settingsChange()
        } catch (err) {
            alert(`Error loading default: ${err}`);
        }
    })

    
    // async function check(fileProp, setting, previousReturn=null) {
    // async function check(properties) {
    async function check() {
        window.addEventListener('pywebviewready', async () => {
            try {
                properties = [
                    [["Excel File"]],
                    [["Sheet Name"], [sheetNameSelector]],
                    [["Header Row Number"], [headerInputSelector]],
                    [["Subject"], [subjectSelector]],
                    [["Start Date"], [eventStartDateSelector]],
                    [["Start Time"], [eventStartTimeSelector]],
                    [["End Date"], [eventEndDateSelector]],
                    [["End Time"], [eventEndTimeSelector]],
                    [["Description1"], [desSel1]],
                    [["Description2"], [desSel2]],
                    [["Description3"], [desSel3]],
                    [["Description4"], [desSel4]],
                    [["Description5"], [desSel5]],
                    [["Location"], [locSel]],
                    [["Private"], [privateSel]],
                    [["All Day Event"], [allDaySel]],
                    [["Profile Selector"], [profileSelector]]
                ]

                // alert(properties[0][0][0])
                try{
                    const profileList = await window.pywebview.api.loadProfiles()
                    loadOptions(profileList, profileSelector)
                    // blankOption(profileSelector)

                }catch (err){
                    console.log(err)
                }
                
                // check for Excel File
                const filePropStatus = await window.pywebview.api.loadUserDefaults(properties[0][0][0]);
                
                console.log("file prop status")
                console.log(filePropStatus)
                console.log("prop bool")
                console.log(filePropStatus.bool)
                if (filePropStatus.bool === true) {
                    // alert(setting)
                    // alert(filePropStatus.value)
                    // setting.value = filePropStatus.value
                    // alert("Excel File")

                    const excelData = await window.pywebview.api.selectExcelFile(filePropStatus.value)
                    // alert(excelData)
                    fileSelected.innerHTML = excelData.path;

                    const excelSheets = JSON.parse(excelData.sheets)
                    // alert(excelSheets)
                    

                    
                    // check if Sheet Name is there
                    const sheetNameStatus = await window.pywebview.api.loadUserDefaults(properties[1][0][0]);
                    
                    // if Sheet Name is there
                    if (sheetNameStatus.bool === true) {
                        // alert("Sheet Name")

                        // load the default sheet name
                        const sheetNameSelected = await window.pywebview.api.selectSheetName(sheetNameStatus.value, true)
                        loadOptions(excelSheets, sheetNameSelector, sheetNameSelected)

                    // [["Header Row Number"], [headerInputSelector]],
                        const headerRowStatus = await window.pywebview.api.loadUserDefaults(properties[2][0][0]);
                        // alert(headerRowStatus)
                        
                        // if Header Row is there
                        console.log("header bool")
                        console.log(headerRowStatus.bool)
                        if (headerRowStatus.bool === true) {

                            // load the default Header Row Number
                            headerInputSelector.value = headerRowStatus.value
                            
                            const headerArray = await window.pywebview.api.selectHeaderInput(headerRowStatus.value, sheetNameSelected, true)
                            console.log("header array")
                            console.log(headerArray)
                                                        
                            async function jsonOptionLoader(jsonProp, selector){
                                // [["Subject"], [subjectSelector]],
                                const status = await window.pywebview.api.loadUserDefaults(jsonProp);
                                
                                if (status.bool === true) {
                                    // load the default sheet name
                                    if (jsonProp == "Status"){
                                        const subjectSelected = await window.pywebview.api.selectSheetName(status.value, true)

                                        loadOptions(headerArray, selector, subjectSelected)
                                    } else {
                                        loadOptions(headerArray, selector, status.value)
                                    }
                                        
                                }
                            }
                            
                            // let col = 3
                            // while (col < properties.length){
                            for (let col = 3; col < properties.length; col++){
                                jsonOptionLoader(properties[col][0][0], properties[col][1][0])
                            }



                            // // [["Subject"], [subjectSelector]],
                            // const subjectStatus = await window.pywebview.api.loadUserDefaults(properties[3][0][0]);
                            
                            // if (subjectStatus.bool === true) {
                            //     // load the default sheet name
                            //     const subjectSelected = await window.pywebview.api.selectSheetName(subjectStatus.value, true)

                            //     loadOptions(headerArray, subjectSelector, subjectSelected)
                            // }


                            // // [["Start Date"], [eventStartDateSelector]],
                            // const startDateStatus = await window.pywebview.api.loadUserDefaults("Start Date");
                            // // alert(`Start date \n ${startDateStatus.bool}`)

                            // if (startDateStatus.bool === true) {
                            //     // properties[3][1][0] = startDateStatus.value
                            //     loadOptions(headerArray, eventStartDateSelector, startDateStatus.value)
                            // }


                            // // [["Start Time"], [eventStartTimeSelector]],
                            // const startTimeStatus = await window.pywebview.api.loadUserDefaults(properties[5][0][0]);
                            // // alert(startTimeStatus)

                            // if (startTimeStatus.bool === true) {
                            //     // properties[3][1][0] = startDateStatus.value
                            //     loadOptions(headerArray, eventStartTimeSelector, startTimeStatus.value)
                            // }


                            // // [["End Date"], [eventEndDateSelector]],
                            // const endDateStatus = await window.pywebview.api.loadUserDefaults(properties[6][0][0]);
                            // // alert(endDateStatus)

                            // if (endDateStatus.bool === true) {
                            //     // properties[3][1][0] = startDateStatus.value
                            //     loadOptions(headerArray, eventEndDateSelector, endDateStatus.value)
                            // }


                            // // [["End Time"], [eventEndTimeSelector]],
                            // const endTimeStatus = await window.pywebview.api.loadUserDefaults(properties[7][0][0]);
                            // // alert(endTimeStatus)

                            // if (endTimeStatus.bool === true) {
                            //     // properties[3][1][0] = startDateStatus.value
                            //     loadOptions(headerArray, eventEndTimeSelector, endTimeStatus.value)
                            // }


                            // // [["Description1"], [desSel1]],
                            // const descriptStat1 = await window.pywebview.api.loadUserDefaults(properties[8][0][0]);
                            // // alert(descriptStat1)

                            // if (descriptStat1.bool === true) {
                            //     // properties[3][1][0] = startDateStatus.value
                            //     loadOptions(headerArray, desSel1, descriptStat1.value)
                            // }


                            // // [["Description2"], [desSel2]],
                            // const descriptStat2 = await window.pywebview.api.loadUserDefaults(properties[9][0][0]);
                            // // alert(descriptStat2)

                            // if (descriptStat2.bool === true) {
                            //     // properties[3][1][0] = startDateStatus.value
                            //     loadOptions(headerArray, desSel2, descriptStat2.value)
                            // }

                            // // [["Description3"], [desSel3]]
                            // const descriptStat3 = await window.pywebview.api.loadUserDefaults(properties[10][0][0]);
                            // // alert(descriptStat3)

                            // if (descriptStat3.bool === true) {
                            //     // properties[3][1][0] = startDateStatus.value
                            //     loadOptions(headerArray, desSel3, descriptStat3.value)
                            // }


                        }
                    }
                }
            } catch (err) {
                console.log(err)
                alert(`Error loading default: ${err}`);
                // create needed key, value pair
            }
        })
    }

    // properties = [
    //     [["Excel File"], [eventNameSelector]],
    //     [["Sheet Name"], [sheetNameSelector]],
    //     [["Header Row Number"], [headerInputSelector]],
    //     [["Start Date"], [eventStartDateSelector]],
    //     [["Start Time"], [eventStartTimeSelector]],
    //     [["End Date"], [eventEndDateSelector]],
    //     [["End Time"], [eventEndTimeSelector]],
    //     [["Description1"], [desSel1]],
    //     [["Description2"], [desSel2]],
    //     [["Description3"], [desSel3]]
    // ]

    // properties = [
    //     [["Excel File"], [eventNameSelector]],
    //     [["Sheet Name"], [sheetNameSelector]],
    //     [["Header Row Number"], [headerInputSelector]],
    //     [["Start Date"], [eventStartDateSelector]],
    //     [["Start Time"], [eventStartTimeSelector]],
    //     [["End Date"], [eventEndDateSelector]],
    //     [["End Time"], [eventEndTimeSelector]],
    //     [["Description1"], [desSel1]],
    //     [["Description2"], [desSel2]],
    //     [["Description3"], [desSel3]]
    // ]

    properties = {
        'Excel File': 'Excel File',
        'Sheet Name': 'Sheet Name',
        'Header Row Number': 'Header Row Number',
        // [["Subject"], [subjectSelector]],
        'Start Date': 'Start Date',
        'Start Time': 'Start Time',
        'End Date': 'End Date',
        'End Time': 'End Time',
        'Description1': 'Description1',
        'Description2': 'Description2',
        'Description3': 'Description3'
    }

    
    check()

    // check(properties)
    // sheetnames = await 
    // check("Excel File", eventNameSelector)
    // check("Sheet Name", sheetNameSelector)
    // check("Header Row Number", headerInputSelector)
    // check("Start Date", eventStartDateSelector)
    // check("Start Time", eventStartTimeSelector)
    // check("End Date", eventEndDateSelector)
    // check("End Time", eventEndTimeSelector)
    // check("Description1", desSel1)
    // check("Description2", desSel2) 
    // check("Description3", desSel3)

                            // if (fileProp === "Excel File") {
                        //     alert("Excel File")
                        //     const excelData = await window.pywebview.api.selectExcelFile(filePropStatus.value)
                        //     const excelSheets = JSON.parse(excelData.sheets)

                        //     loadOptions(excelSheets, sheetNameSelector)
                        // } else if (fileProp === "Sheet Name") {
                        //     alert("Sheet Name")
                        //     const sheetNameSelected = await window.pywebview.api.selectSheetName(filePropStatus.value, true)
                        // } else if (fileProp === "Header Row Number") {
                        //     // alert(`setting ${fileProp}`)
                        //     headerInputSelector.value = filePropStatus.value
                        // }

})