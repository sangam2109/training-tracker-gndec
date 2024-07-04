import { base64toBlob } from '../utils/base64topdf';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { getAllData } from './AdminFunctions';
const API_URL =
    import.meta.env.VITE_ENV === "production"
        ? import.meta.env.VITE_PROD_BASE_URL
        : import.meta.env.VITE_DEV_BASE_URL;

 export const handleExportFullData = async (setLoading) => {
        setLoading(true)
         const data=await getAllData()
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Training Data');

        // Define column headers
        const columns = [
            { header: 'Name', key: 'Name' },
            { header: 'College Email', key: 'CollegeEmail' },
            { header: 'University Roll Number', key: 'UniversityRollNumber' },
            { header: 'College Roll Number', key: 'CollegeRollNumber' },
            { header: 'Gender', key: 'Gender' },
            { header: 'Mentor Name', key: 'MentorName' },
            { header: 'Batch', key: 'Batch' },
            { header: 'Section', key: 'Section' },
            { header: "Mother's Name", key: 'MotherName' },
            { header: "Father's Name", key: 'FatherName' },
            { header: 'Contact Number', key: 'ContactNumber' },
            { header: 'Admission Type', key: 'AdmissionType' },
            { header: 'Personal Email', key: 'PersonalEmail' },

            //tr101
            { header: 'Training Type', key: 'TrainingType1' },
            { header: 'Organization Name', key: 'OrganizationName1' },
            { header: 'Project Name', key: 'ProjectName1' },
            { header: 'Technology Used', key: 'TechnologyUsed1' },
            { header: 'Training Certificate', key: 'TrainingCertificate1' },

            //tr102
            { header: 'Training Type', key: 'TrainingType2' },
            { header: 'Organization Name', key: 'OrganizationName2' },
            { header: 'Project Name', key: 'ProjectName2' },
            { header: 'Technology Used', key: 'TechnologyUsed2' },
            { header: 'Training Certificate', key: 'TrainingCertificate2' },

            //tr103
            { header: 'Training Type', key: 'TrainingType3' },
            { header: 'Organization Name', key: 'OrganizationName3' },
            { header: 'Project Name', key: 'ProjectName3' },
            { header: 'Technology Used', key: 'TechnologyUsed3' },
            { header: 'Training Certificate', key: 'TrainingCertificate3' },

            //tr104
            { header: 'Training Type', key: 'TrainingType4' },
            { header: 'Organization Name', key: 'OrganizationName4' },
            { header: 'Project Name', key: 'ProjectName4' },
            { header: 'Technology Used', key: 'TechnologyUsed4' },
            { header: 'Training Certificate', key: 'TrainingCertificate4' },

            //placement data
            { header: 'Placed Status', key: 'PlacedStatus' },
            { header: 'Company', key: 'Company' },
            { header: 'Placement Type', key: 'PlacementType' },
            { header: 'Appointment Number', key: 'AppointmentNumber' },
            { header: 'Appointment Letter', key: 'AppointmentLetter' },
            { header: 'Package', key: 'Package' },
            { header: 'Appointment Date', key: 'AppointmentDate' },
            { header: 'Designation', key: 'Designation' },
            { header: 'Higher Study Status', key: 'HigherStudyStatus' },
            { header: 'Higher Study Place', key: 'HigherStudyPlace' },
            { header: 'Gate Appeared Status', key: 'GateAppearedStatus' },
            { header: 'Gate Admit Card/ ScoreCard', key: 'GateAdmitCard' }
        ];
        sheet.columns = columns;
        // Populate data rows
     const hyperlinkStyle = {
         font: { color: { argb: '0000FF' }, underline: true },
         alignment: { vertical: 'middle', horizontal: 'left' }
     };
        data.forEach(row => {
            const rowData = {
                Name: row.userInfo.Name,
                CollegeEmail: row.email,
                UniversityRollNumber: row.userInfo.urn,
                CollegeRollNumber: row.crn,
                Gender: row.userInfo.gender,
                MentorName: row.userInfo.mentor,
                Batch: row.userInfo.batch,
                Section: row.userInfo.section,
                MotherName: row.userInfo.mother,
                FatherName: row.userInfo.father,
                ContactNumber: row.userInfo.contact,
                AdmissionType: row.userInfo.admissionType,
                PersonalEmail: row.userInfo.personalMail,
                TrainingType1: row.tr101.type,
                OrganizationName1: row.tr101.organization,
                ProjectName1:row.tr101.projectName,
                TechnologyUsed1: row.tr101.technology.join(', '),
                //tr102
                TrainingType2: row.tr102.type,
                OrganizationName2: row.tr102.organization,
                ProjectName2: row.tr102.projectName,
                TechnologyUsed2: row.tr102.technology.join(', '),
                //tr103
                TrainingType3: row.tr103.type,
                OrganizationName3: row.tr103.organization,
                ProjectName3: row.tr103.projectName,
                TechnologyUsed3: row.tr103.technology.join(', '),
                //tr104
                TrainingType4: row.tr104.type,
                OrganizationName4: row.tr104.organization,
                ProjectName4: row.tr104.projectName,
                TechnologyUsed4: row.tr104.technology.join(', '),
                //placementData
                PlacedStatus: row.placementData.isPlaced,
                Company: row.placementData.company,
                PlacementType : row.placementData.placementType,
                AppointmentNumber : row.placementData.appointmentNo,
                Package : row.placementData.package,
                AppointmentDate : row.placementData.appointmentDate,
                Designation : row.placementData.designation,


            };
            if (row.tr101.certificate) {
                const certificateURL = `${API_URL}certificate/tr101/${row._id}`; // Replace with actual URL
                rowData['TrainingCertificate1'] = { text: 'View Certificate', hyperlink: certificateURL };
                
            }
            if (row.tr102.certificate) {
                const certificateURL = `${API_URL}certificate/tr102/${row._id}`; // Replace with actual URL
                rowData['TrainingCertificate1'] = { text: 'View Certificate', hyperlink: certificateURL };

            }
            if (row.tr103.certificate) {
                const certificateURL = `${API_URL}certificate/tr103/${row._id}`; // Replace with actual URL
                rowData['TrainingCertificate1'] = { text: 'View Certificate', hyperlink: certificateURL };

            }
            if (row.tr104.certificate) {
                const certificateURL = `${API_URL}certificate/tr104/${row._id}`; // Replace with actual URL
                rowData['TrainingCertificate1'] = { text: 'View Certificate', hyperlink: certificateURL };

            }
            if (row.placementData.appointmentLetter) {
                const certificateURL = `${API_URL}certificate/appointmentLetter/${row._id}`; // Replace with actual URL
                rowData['AppointmentLetter'] = { text: 'View Certificate', hyperlink: certificateURL };

            }
            if (row.placementData.gateCertificate) {
                const certificateURL = `${API_URL}certificate/gateCertificate/${row._id}`; // Replace with actual URL
                rowData['GateAdmitCard'] = { text: 'View Certificate', hyperlink: certificateURL };

            }
         

               
            sheet.addRow(rowData);
 })
     sheet.eachRow({ includeEmpty: false }, function (row) {
         row.eachCell({ includeEmpty: false }, function (cell) {
             if (cell.value && cell.value.hyperlink) {
                 cell.style = hyperlinkStyle;
             }
         });
     });
     sheet.columns.forEach(column => {
         column.width = 20;
     });
        // Generate Excel file and download
        const buffer = await workbook.xlsx.writeBuffer();
        const excelBlob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
     setLoading(false)
        saveAs(excelBlob, 'training_data.xlsx');
    };

   



