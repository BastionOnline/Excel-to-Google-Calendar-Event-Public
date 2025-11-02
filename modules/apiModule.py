import shutil
import os
import pandas as pd
import json

from tkinter import filedialog, messagebox


from modules.userDefaultsModule import createConfigFolder, setDefault, createJson, updateJsonExcel, loadJson, defaultCheck

from modules.columnFormatModule import columnFormat
from modules.exportFileModule import exportFile
from modules.blankFillerModule import blankFiller
from modules.missingIndexModule import missingIndex
from modules.chartPrepModule import chartPrep
from modules.exportStandardFileModule import exportStandardFile


templateFolderDir, jsonFileName, jsonFilePath, templateFolderStat = createConfigFolder("Profiles", "Current Profile.json")
createJson(templateFolderStat, templateFolderDir, jsonFilePath)

print(jsonFilePath)


class Api:
    # def __init__(self, window, jsonPath=jsonFile):
    def __init__(self, window, jsonFilePath=jsonFilePath):
        self.jsonFilePath = jsonFilePath
        self.balanceFilePath = None
        self.window = window
        self.sheetName = None
        self.headerInput = None

    def loadUserDefaults(self, jsonValue):
        try:
            if os.path.exists(self.jsonFilePath):
                # if there is a json file load it
                userDefaults = loadJson(self)

                # check value sent from json to see if it is present
                print(userDefaults)
                requestedValue = defaultCheck(jsonValue, userDefaults)
                return requestedValue

            # if there is no json file, make one
            else:
                userDefaults = createJson()
                requestedValue = False
                # need to send a request to select model
                return requestedValue
            
        except Exception as e:
            print(e)
            return {"location": "exception block",
                    "value": "create key, value pair"}

    def checkUserDefaults(self, jsonValue):
        try:
            print(jsonValue)
            if os.path.exists(self.jsonPath):
                # if there is a json file load it
                userDefaults = loadJson(self)

                # check value sent from json to see if it is present
                print(userDefaults)
                requestedValue = defaultCheck(jsonValue, userDefaults)
                return requestedValue
            else:
                createJson()
                requestedValue = defaultCheck(jsonValue, userDefaults)
                return requestedValue
            
        except Exception as e:
            print(e)
            return requestedValue


    def selectExcelFile(self, default=None):
        if default and os.path.exists(default):
            print(default)
            self.excelFilePath = os.path.normpath(default)
        else:
            try:
                # use os.path.normpath to standardize path formats
                self.excelFilePath = os.path.normpath(filedialog.askopenfilename(
                    title="Select a Excel file for Google Calendar",
                    filetypes=[("Excel Files", "*.xls *.xlsx")]     
                ))
                print(self.excelFilePath)
                # pd.ExcelFile(self.excelFilePath)
            except Exception as e:
                print(e)
                # return "No file selected"
                
            
        print(self.excelFilePath)

        # return Excel pages found
        excelFile = pd.ExcelFile(self.excelFilePath)
        sheetNames = excelFile.sheet_names
        print(sheetNames)
        jsonSheetNames = json.dumps(sheetNames)
        print(jsonSheetNames)

        pathAndSheets = [self.excelFilePath, jsonSheetNames]
        print(pathAndSheets)

        if not default:
            setDefault("Excel File", self.excelFilePath, jsonFilePath)

        # return with json to use as array in JS, NOT string
        return {
            "path": self.excelFilePath,
            "sheets": jsonSheetNames
        }
    
    def profileSelect(self, profileName):
        profileFile = f"{profileName}.json"
        setDefault("Profile", profileFile, jsonFilePath)
        print(profileName)

        profileFilePath = os.path.join(templateFolderDir, profileFile)
        
        # config

        shutil.copy(profileFilePath, jsonFilePath)

        with open(jsonFilePath, "r") as f:
            userDefaults = json.load(f)

        # with open(self.jsonFilePath, "w") as f:
        #     json.dump(userDefaults, f, indent=4)

        # userDefaults["theme"] = "dark"
        # userDefaults["lastLogin"] = "2025-10-27"

        # # Write it back to the same file
        # with open(profileFilePath, "w") as f:
        #     json.dump(userDefaults, f, indent=4)


        print(userDefaults)
        return userDefaults

    
    def saveProfile(self, profileName):
        # Source file and new filename
        srcProf = self.jsonFilePath
        folder, file= os.path.split(srcProf)
        newProf = f"{profileName}.json"
        newProfDir = os.path.join(folder, newProf)

        print(profileName)
        print(newProfDir)


        def createProf():
            shutil.copy(srcProf, newProfDir)

            print(f"\n{profileName} saved")
            print(f"Location: \n{newProfDir}")

            profileList = [
                # split the file and take only the name
                os.path.splitext(f)[0]

                # look in this folder
                for f in os.listdir(templateFolderDir)

                # if it ends with json and the split text name doesnt say this
                if f.endswith('.json') and os.path.splitext(f)[0] != "Current Profile"
                ]
            
            return profileList




        # figure if its there
            # if yes, ask
                # if yes save
            # if no, save

        if os.path.exists(newProfDir) == True:
            if messagebox.askyesno(f"Replace {profileName}", f"Are you sure you want to save over {profileName}?"):
                profileList = createProf()
                return profileList
            else:
                return
        else:
            profileList = createProf()
            return profileList
        
        #after save remove request to save

            # return [os.path.splitext(f)[0] for f in os.listdir(templateFolderDir) if f.endswith('.json')]


    def loadProfiles(self):
        # profileList = [os.path.splitext(f)[0] for f in os.listdir(templateFolderDir) if f.endswith('.json')]
        profileList = [
            # split the file and take only the name
            os.path.splitext(f)[0]

            # look in this folder
            for f in os.listdir(templateFolderDir)

            # if it ends with json and the split text name doesnt say this
            if f.endswith('.json') and os.path.splitext(f)[0] != "Current Profile"
            ]
        
        return profileList
        # os.listdir(folder_path) lists all files.
        # if f.endswith('.json') filters only JSON files.
        # os.path.splitext(f)[0] removes the .json extension from each filename.



    def deleteProfile(self, profileDelete):
        if messagebox.askyesno(f"Delete {profileDelete}", f"Are you sure you want to delete {profileDelete}?"):
            profileJsonName = f"{profileDelete}.json"
            profileFilePath = os.path.join(templateFolderDir, profileJsonName)
            os.remove(profileFilePath)
            print(f"Delete {profileDelete}")

    def selectSheetName(self, sheetName, default=None):
        # if default and os.path.exists(default):
        #     print(default)
        #     self.excelFilePath = os.path.normpath(default)

        self.sheetName = sheetName
        print(f"Sheet Name Setting: {self.sheetName}")

        if not default:
            setDefault("Sheet Name", self.sheetName, jsonFilePath)

        return self.sheetName

    def clearAll(self):
        if os.path.exists(jsonFilePath) == True:
            allSettings = [
                "Sheet Name",
                "Header Row Number",
                "Subject",
                "Start Date",
                "Start Time",
                "End Date",
                "End Time",
                "Description1",
                "Description2",
                "Description3",
                "Description4",
                "Description5",
                "Location",
                "Private",
                "All Day Event"
            ]
            
            try:
                with open(jsonFilePath, "r") as f:
                    data = json.load(f)
            except (FileNotFoundError, json.JSONDecodeError):
                data = {}

            for setting in allSettings:
                # setDefault(column, headers[0], jsonFilePath)
                print(setting)

                # Update the dictionary
                data[setting] = ""

            print(data)

            # Write the updated data back to the file (pretty format)
            with open(jsonFilePath, "w") as f:
                json.dump(data, f, indent=4)

            userDefaults = loadJson(self)

            return userDefaults

    def selectHeaderInput(self, headerInput, sheetNameInput, default=None):
        # self.headerInput = int(headerInput)
        print(f"Header Setting: {headerInput}")
        print(f"Sheet Setting: {sheetNameInput}")

        if not default:
            setDefault("Header Row Number", int(headerInput), jsonFilePath)
            setDefault("Sheet Name", sheetNameInput, jsonFilePath)
            # setDefault("Header Row Number", self.headerInput, jsonFilePath)

        # switch to reading json
        presetJson = loadJson(self)
        print(presetJson)
        filePath = presetJson["Excel File"]
        print(filePath)
        sheetName = presetJson["Sheet Name"]
        print(sheetName)
        headerRowNumber = int(presetJson["Header Row Number"])
        print(headerRowNumber)

        df = pd.read_excel(filePath, sheet_name=sheetName, header=headerRowNumber-1)
        print(df)
        # df = pd.read_excel(self.excelFilePath, sheet_name=self.sheetName, header=self.headerInput - 1)
        headers = df.columns.tolist()
        print(headers)

        # if not default:
        allColumns = [
            "Subject",
            "Start Date",
            "Start Time",
            "End Date",
            "End Time",
            "All Day Event",
            "Description1",
            "Description2",
            "Description3",
            "Description4",
            "Description5",
            "Location",
            "Private"
        ]

        print(headers[0])

        try:
            with open(jsonFilePath, "r") as f:
                data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            data = {}

        for column in allColumns:
            # setDefault(column, headers[0], jsonFilePath)
            print(column)
            print(headers[0])

            # Update the dictionary
            data[column] = headers[0]

        print(data)

        # Write the updated data back to the file (pretty format)
        with open(jsonFilePath, "w") as f:
            json.dump(data, f, indent=4)

        # return self.headerInput
        return headers
    
    def selectEventNameInput(self, eventNameSelector):
        self.eventNameInput = eventNameSelector
        print(f"Subject Setting: {self.eventNameInput}")

        setDefault("Subject", self.eventNameInput, jsonFilePath)

        return self.eventNameInput
    
    def selectEventStartDateInput(self, eventStartDateSelector):
        self.eventStartDateInput = eventStartDateSelector
        print(f"Start Date Setting: {self.eventStartDateInput}")

        setDefault("Start Date", self.eventStartDateInput, jsonFilePath)

        return self.eventStartDateInput
    
    def selectEventStartTimeInput(self, eventStartTimeSelector):
        self.eventStartTimeInput = eventStartTimeSelector
        print(f"Start Time Setting: {self.eventStartTimeInput}")

        setDefault("Start Time", self.eventStartTimeInput, jsonFilePath)

        return self.eventStartTimeInput
    
    def selectEventEndDateInput(self, eventEndDateSelector):
        self.eventEndDateInput = eventEndDateSelector
        print(f"End Date Setting: {self.eventEndDateInput}")

        setDefault("End Date", self.eventEndDateInput, jsonFilePath)

        return self.eventEndDateInput

    def selectEventEndTimeInput(self, eventEndTimeSelector):
        self.eventEndTimeInput = eventEndTimeSelector
        print(f"End Time Setting: {self.eventEndTimeInput}")

        setDefault("End Time", self.eventEndTimeInput, jsonFilePath)

        return self.eventEndTimeInput
    
    def selectEventDescription1(self, eventDesriptionSelector1):
        self.eventDescriptionInput1 = eventDesriptionSelector1
        print(f"Description 1 Setting: {eventDesriptionSelector1}")

        setDefault("Description1", self.eventDescriptionInput1, jsonFilePath)

        return self.eventDescriptionInput1
    
    def selectEventDescription2(self, eventDesriptionSelector2):
        self.eventDescriptionInput2 = eventDesriptionSelector2
        print(f"Description 2 Setting: {self.eventDescriptionInput2}")

        setDefault("Description2", self.eventDescriptionInput2, jsonFilePath)

        return self.eventDescriptionInput2
    
    def selectEventDescription3(self, eventDesriptionSelector3):
        self.eventDescriptionInput3 = eventDesriptionSelector3
        print(f"Description 3 Setting: {self.eventDescriptionInput3}")

        setDefault("Description3", self.eventDescriptionInput3, jsonFilePath)

        return self.eventDescriptionInput3
    
    def selectEventDescription4(self, eventDesriptionSelector4):
        self.eventDescriptionInput4 = eventDesriptionSelector4
        print(f"Description 4 Setting: {self.eventDescriptionInput4}")

        setDefault("Description4", self.eventDescriptionInput4, jsonFilePath)

        return self.eventDescriptionInput4
    
    def selectEventDescription5(self, eventDesriptionSelector5):
        self.eventDescriptionInput5 = eventDesriptionSelector5
        print(f"Description 5 Setting: {self.eventDescriptionInput5}")

        setDefault("Description5", self.eventDescriptionInput5, jsonFilePath)

        return self.eventDescriptionInput5
    

    def selectLocSel(self, jsLocSel):
        self.locSel = jsLocSel
        print(f"Location Setting: {self.locSel}")

        setDefault("Location", self.locSel, jsonFilePath)

        return self.locSel
    

    def selectPrivateSel(self, jsPrivateSel):
        self.privateSel = jsPrivateSel
        print(f"Private Setting: {self.privateSel}")

        setDefault("Private", self.privateSel, jsonFilePath)

        return self.privateSel

    def selectAllDaySel(self, jsAllDaySel):
        self.allDaySel = jsAllDaySel
        print(f"All Day Setting Setting: {self.allDaySel}")

        setDefault("All Day Event", self.allDaySel, jsonFilePath)

        return self.allDaySel

    def startCalendar(self):

        # send config name
        # send all the properties needed for building


        # mandatory fields:
        # Subject, start datetime *add note, events will be created as ALL day if time is not given

        # df = pd.read_excel(FileSelect, sheet_name="POA Clients", usecols=importcol)
        # fields = [
        #     getattr(self, "eventNameInput", ""), 
        #     getattr(self, "eventStartDateInput", ""),
        #     getattr(self, "eventStartTimeInput", ""),
        #     getattr(self, "eventEndDateInput", ""),
        #     getattr(self, "eventEndTimeInput", ""),
        #     getattr(self, "eventDescriptionInput1",""),
        #     getattr(self, "eventDescriptionInput2",""),
        #     getattr(self, "eventDescriptionInput3","")
        #     ]
        

        config = loadJson(self)
        print(config)

        ignore_keys = {"Profiles", "Excel File", "Sheet Name", "Header Row Number"}
        fields = []

        for key, val in config.items():
            print(key)
            print(val)
            if key in ignore_keys:
                continue  # skip ignored rows

            attr_name = key.replace(" ", "_")
            if hasattr(self, attr_name):
                attr_val = getattr(self, attr_name)
                if attr_val != "":
                    fields.append(attr_val)
            elif val != "":
                fields.append(val)

        print(fields)

        importcol = [val for val in fields if val != ""]
        print(importcol)

        fileSelect = config["Excel File"]
        # fileSelect = self.excelFilePath
        print(fileSelect)

        sheetName = config["Sheet Name"]
        print(sheetName)

        headerInput = int(config["Header Row Number"])
        print(headerInput)


        df = pd.read_excel(fileSelect, sheet_name=sheetName, usecols=importcol, header=headerInput-1)
        # df = pd.read_excel(self.excelFilePath, sheet_name=self.sheetName, usecols=importcol, header=self.headerInput-1)
        print(df)

        if (importcol == ["Subject", "Offence Number", "Start Date", "Start Time", "Description"]):
            DirMain = os.getcwd()
            df = blankFiller(df)
            df = columnFormat(df)
            df, DataMissingidx, DataMissingdf = missingIndex(df)
            df, excelexport = chartPrep(df)
            exportFile(DirMain, df, excelexport, DataMissingdf, fileSelect)
        else:
            # RETURN values for user to select
            # export selection
            # eventsFound = exportStandardFile(df, fileSelect, self)
            eventsFound, duplicates = exportStandardFile(df, fileSelect, config)
            # check what values are given
            return {
                "found": eventsFound,
                "path": fileSelect,
                "duplicatesFound": duplicates
            }
        
    def openCsvFolder(self):
        
        heist = loadJson(self)
        folder, file = os.path.split(heist["Excel File"])

        # Handle different OS
        # if platform.system() == "Windows":
        os.startfile(folder)
        return f"Opened: {folder}"