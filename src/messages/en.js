export default {
    common: {
        script: 'Script',
        grade: 'Grade',
        course: 'Course',
        lang: 'Language',
        institute: 'Institute',
        relativeLocation: 'Relative loc.'
    },
    actions: {
        filter: 'Filter',
        cancel: 'Cancel',
        save: 'Save',
        goBack: 'Go back'       
    },    
    layout: {
        subtitle: 'Anatome Authoring Tool'
    },
    home: {
        title: 'Scripts',
        actions: {
            goToScriptContent: 'Go to piece content'
        },
        tables: {
            scriptContent: {
                title: 'Scripts contents',
                actions: {
                    add: 'Add script'
                }
            },
            pinnedScripts: {
                title: 'Pinned Scripts',
                actions: {
                    pin: 'Pin up location'
                }
            }
        }
    },
    pieceContent: {
        title: 'New piece content',
        sections: {
            theoricalKnowledge:{
                title: 'Theoretical Content (TC)',
                description: 'Select one or more anatomical parts and then enter the associated Theoretical Knowledge without mentioning the name of the part (s). Access help or examples for more information',
                actions: {
                    add: 'Add TC',
                    addToNewPart: 'Add TC to new part'
                }
            }
        }
    },
    pinnedScript: {
        sections: {
            assocBetweenNameAndLoc: {
                title: 'Association between the part\'s name and location on the part',
                description: 'Associate the name of each anatomical part with the number of the arrow (or label) that indicates its location on the physical part',            
            }
        },
        actions: {
            save: 'Save pinned script'
        }            
    }     
}