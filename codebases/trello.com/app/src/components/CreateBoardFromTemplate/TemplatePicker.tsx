import React from 'react';
import { TemplateBoardCreate } from 'app/src/components/Templates/types';
import { Tile } from './Tile';
import { TemplatePickerCollapsibleSection } from './TemplatePickerCollapsibleSection';

import styles from './TemplatePicker.less';
import { noop } from 'app/src/noop';

interface AllTemplatesType {
  title: string;
  templates: TemplateBoardCreate[];
}
interface TemplatePickerProps {
  onSelectTemplate: ({ id, name }: { id: string; name: string }) => void;
  allTemplates: AllTemplatesType[];
}

export const TemplatePicker: React.FunctionComponent<TemplatePickerProps> = ({
  onSelectTemplate,
  allTemplates,
}) => {
  return (
    <div className={styles.templatePickerContainer}>
      {allTemplates
        .filter(({ templates }) => templates.length)
        .map(({ title, templates }) => (
          <TemplatePickerCollapsibleSection
            key={title}
            title={title}
            onToggle={noop}
            trackToggle={noop}
            tabIndex={0}
          >
            {templates.map((template) => (
              <Tile
                key={`${title}-${template.id}`}
                boardId={template.id}
                boardName={template.name}
                backgroundColor={template.prefs.backgroundColor}
                backgroundUrl={template.prefs.backgroundImage}
                // eslint-disable-next-line react/jsx-no-bind
                onSelectTemplate={() =>
                  onSelectTemplate({
                    id: template.id,
                    name: template.name,
                  })
                }
              />
            ))}
          </TemplatePickerCollapsibleSection>
        ))}
    </div>
  );
};
