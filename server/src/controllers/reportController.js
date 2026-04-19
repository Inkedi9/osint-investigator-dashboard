const { generateCasePdf } = require("../services/pdfService");
const { reportCases, reportEntities } = require("../data/reportCases");

async function generateCasePdfReport(req, res) {
  try {
    const { id } = req.params;

    const {
      currentCase: currentCaseFromBody,
      linkedEntities: linkedEntitiesFromBody,
      ...reportContext
    } = req.body || {};

    const currentCase =
      currentCaseFromBody || reportCases.find((item) => item.id === id);

    console.log("REPORT DEBUG", {
      routeId: id,
      bodyHasCurrentCase: !!currentCaseFromBody,
      bodyCurrentCaseId: currentCaseFromBody?.id,
      resolvedCaseId: currentCase?.id,
    });

    if (!currentCase) {
      return res.status(404).json({
        success: false,
        error: "Case not found",
      });
    }

    const linkedEntities =
      Array.isArray(linkedEntitiesFromBody) && linkedEntitiesFromBody.length > 0
        ? linkedEntitiesFromBody
        : reportEntities.filter((entity) =>
            (currentCase.entityIds || []).includes(entity.id),
          );

    const pdfBuffer = await generateCasePdf(
      currentCase,
      linkedEntities,
      reportContext,
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${currentCase.id}-report.pdf"`,
    );

    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error.message);

    res.status(500).json({
      success: false,
      error: "Failed to generate PDF report",
      details: error.message,
    });
  }
}

module.exports = {
  generateCasePdfReport,
};
