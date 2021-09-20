import React, {
    useCallback
} from 'react'

import logger from '~/lib/logger'
import {
    Page
} from '~/lib/constants'

export const useGetPdfFileBlob = (pdfComponentPath, props) => {
        return useCallback(async () => {
                let fileBlob = {}
                await
                import ('@react-pdf/renderer').then(async pdfRenderer => {
                        let PdfComponent = null

                        switch (pdfComponentPath) {
                            case Page.MaturityAssessmentReport:
                                // eslint-disable-next-line no-case-declarations
                                const {
                                    default: MaturityAssessmentPdf
                                } = await
                                import (
                                    /* webpackMode: "lazy" */
                                    '~/pages/maturity-assessment-report/pdf/index'
                                )
                                PdfComponent = MaturityAssessmentPdf
                                break
                            case Page.EngineeringManagerReport:
                                // eslint-disable-next-line no-case-declarations
                                const {
                                    default: EngineeringManagerReportPdf
                                } = await
                                import (
                                    /* webpackMode: "lazy" */
                                    '~/pages/engineering-manager-report/pdf/index'
                                )
                                PdfComponent = EngineeringManagerReportPdf
                                break
                        }

                        try {
                            fileBlob = await pdfRenderer.pdf( < PdfComponent { ...props
                                }
                                />).toBlob()
                            }
                            catch (error) {
                                logger.error('Error creating a PDF', {
                                    error
                                })
                                throw error
                            }

                            return fileBlob
                        }) return fileBlob
                }, [pdfComponentPath, props])
        }