import * as Excel from 'exceljs';
import _ from 'lodash';

import { CONTENT_TYPE_OPEN_XML_FORMATS } from '@/common/constant';
import { S3Adapter } from '@/services/aws/s3';

export interface JobResultDataGenerator {
  email: string;
  fullName: string;
  phoneNumber: string;
  cv: string;
  accepted: boolean;
}

export class GenerateJobResultCommand {
  static async excelGenerator(data: JobResultDataGenerator[], sheetName: string) {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet(sheetName);
    if (data[0]) {
      const columns = Object.keys(data[0]).map(e => {
        const headerName = _.startCase(e);
        return {
          header: headerName,
          key: e,
          width: e.length + 5
        };
      });

      sheet.columns = columns;

      sheet.autoFilter = {
        from: 'A1',
        to: {
          row: 1,
          column: columns.length
        }
      };

      sheet.getRow(1).font = {
        color: { argb: '00000000' },
        bold: true
      };
      sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFFFF' }
      };

      for (const e of data) {
        sheet.addRow(e);
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  static async exportResult(data: any, fileKey: string) {
    const S3 = new S3Adapter();
    const key = `${fileKey}/${Date.now()}.xlsx`;
    const uploadedData = await S3.upload(data, key, CONTENT_TYPE_OPEN_XML_FORMATS);
    return uploadedData['Location'];
  }
}
