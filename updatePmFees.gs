// Google Apps Script to update PM fee formulas (row 11) across project compensation sheets.
// This is a temporary helper – delete after running once.
// How to use:
// 1. Place this script in the same spreadsheet that contains 『Import_マスタ』.
// 2. Run updatePmFeeFormulas() with script editor permissions.
//    It will loop over URLs listed in column I (9) starting row 4 and
//    replace C11:R11 formulas in the tab 『報酬管理(ディレクター)』.
// 3. Verify a few projects (July/Aug) then remove this script.

/**
 * Updates PM fee formulas (row 11, columns C–R) in every project file
 * whose URL is stored in Import_マスタ!I4:I.
 * Belle Lus is assumed already processed and will be skipped automatically.
 */
function updatePmFeeFormulas() {
  const masterSS = SpreadsheetApp.getActiveSpreadsheet();
  const masterSheet = masterSS.getSheetByName('Import_マスタ');
  if (!masterSheet) {
    throw new Error('Sheet "Import_マスタ" not found.');
  }

  const startRow = 4;           // first data row
  const urlCol   = 9;           // column I (1-based)
  const lastRow  = masterSheet.getLastRow();
  const urls     = masterSheet.getRange(startRow, urlCol, lastRow - startRow + 1, 1).getValues();

  // Sample formula for cell C11 (relative references handled via copy).
  const baseFormula = `=IFERROR(
  LET(
    rank, C$10,
    case_name, $C$2,
    director, C$8,
    target_month, $B$7,
    pm_fee, INDEX('Import_マスタ'!$D$4:$D, MATCH(rank, 'Import_マスタ'!$B$4:$B, 0)),
    header_range, 'Import_PM管理表'!$C$2:$ZZ$2,
    month_col_offset, MATCH(target_month, header_range, 0),
    data_range, 'Import_PM管理表'!$C$4:$ZZ$1000,
    row_idx, MATCH(case_name, 'Import_PM管理表'!$B$4:$B$1000, 0),
    count_val, INDEX(data_range, row_idx, month_col_offset),
    pm_name_val, INDEX(data_range, row_idx, month_col_offset + 1),
    is_match, REGEXREPLACE(TRIM(pm_name_val), "\\s+", "") = REGEXREPLACE(TRIM(director), "\\s+", ""),
    IF(is_match, VALUE(pm_fee) * VALUE(count_val), "")
  ),
  ""
)`;

  urls.forEach(([url], idx) => {
    if (!url) return;                       // skip blanks

    try {
      const projectSS = SpreadsheetApp.openByUrl(url);
      const feeSheet  = projectSS.getSheetByName('報酬管理(ディレクター)');
      if (!feeSheet) {
        console.warn(`Sheet 『報酬管理(ディレクター)』 not found in ${url}`);
        return;
      }

      // Skip if already updated (formula exists in C11 and matches base).
      const currentFormula = feeSheet.getRange('C11').getFormula();
      if (currentFormula && currentFormula.trim() === baseFormula.trim()) {
        console.log(`Row ${startRow + idx}: already up-to-date – skipping.`);
        return;
      }

      // Set base formula in C11 then copy across to R11 (columns 3-18).
      feeSheet.getRange('C11').setFormula(baseFormula);
      feeSheet.getRange('C11').copyTo(feeSheet.getRange('C11:R11'));

      console.log(`Row ${startRow + idx}: formulas updated for ${projectSS.getName()}`);
    } catch (e) {
      console.error(`Row ${startRow + idx}: failed for URL ${url}: ${e.message}`);
    }
  });

  SpreadsheetApp.flush();
  Logger.log('PM fee formulas update complete.');
}