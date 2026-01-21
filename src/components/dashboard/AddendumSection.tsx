import { SectionContainer, SubSection } from './SectionContainer';
import { sampleInfo } from '@/data/mockRNAsumData';

export function AddendumSection() {
  return (
    <SectionContainer id="addendum" title="Addendum">
      <SubSection title="Analysis details">
        <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">Sample ID:</span>
              <span className="ml-2 font-mono font-medium">{sampleInfo.sampleId}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Patient ID:</span>
              <span className="ml-2 font-mono font-medium">{sampleInfo.patientId}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cancer Type:</span>
              <span className="ml-2 font-medium">{sampleInfo.cancerType}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Reference Cohort:</span>
              <span className="ml-2 font-medium">{sampleInfo.referenceCohort}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Analysis Date:</span>
              <span className="ml-2 font-mono">{sampleInfo.analysisDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Library ID:</span>
              <span className="ml-2 font-mono">{sampleInfo.libraryId}</span>
            </div>
          </div>
        </div>
      </SubSection>

      <SubSection title="Methods">
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p>
            RNA sequencing data was processed using the RNAsum pipeline. Gene expression values 
            were normalized using TPM (Transcripts Per Million) and compared against the reference 
            cohort to calculate Z-scores.
          </p>
          <p className="mt-3">
            Z-scores represent the number of standard deviations from the cohort mean:
          </p>
          <ul className="mt-2 space-y-1">
            <li><strong>Z ≥ 2:</strong> Significantly upregulated</li>
            <li><strong>Z ≤ -2:</strong> Significantly downregulated</li>
            <li><strong>-2 &lt; Z &lt; 2:</strong> Within normal range</li>
          </ul>
        </div>
      </SubSection>

      <SubSection title="References">
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            <a 
              href="https://github.com/umccr/RNAsum" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              RNAsum
            </a>{' '}
            - UMCCR RNA-seq reporting tool
          </p>
          <p>
            <a 
              href="https://github.com/sigven/pcgr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              PCGR
            </a>{' '}
            - Personal Cancer Genome Reporter
          </p>
          <p>
            <a 
              href="https://ccsm.uth.edu/FusionGDB" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              FusionGDB
            </a>{' '}
            - Fusion Gene annotation DataBase
          </p>
        </div>
      </SubSection>

      <SubSection title="Disclaimer">
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 text-sm text-muted-foreground">
          <p>
            This report is for research use only and should not be used for clinical decision-making 
            without validation by a certified clinical laboratory. The findings presented here require 
            interpretation by a qualified healthcare professional in the context of the patient's 
            clinical presentation.
          </p>
        </div>
      </SubSection>
    </SectionContainer>
  );
}
