import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {
    addItemCustomExtensionAction,
    deleteItemCustomExtensionAction,
    updateItemCustomExtensionPropertyAction,
} from '../../../store/treeStore/treeActions';
import Btn from '../../Btn/Btn';
import {Extension, ValueSetComposeIncludeConcept} from '../../../types/fhir';
import createUUID from '../../../helpers/CreateUUID';
import {ICustomExtensionProperty} from '../../../types/IQuestionnareItemType';
import {TreeContext} from '../../../store/treeStore/treeStore';
import {ValidationErrors} from '../../../helpers/orphanValidation';
import FormField from '../../FormField/FormField';
import InputField from '../../InputField/inputField';
import Select from '../../Select/Select';

type ExtensionProps = {
    linkId: string;
    itemValidationErrors: ValidationErrors[];
};

const DIFFIA_EXTENSION_URL_PREFIX = 'https://api.diffia.com/fhir/StructureDefinition/';

export enum DiffiaCustomExtension {
    ExternalThreshold = 'external-threshold',
    ExternalAggregatedThreshold = 'external-aggregated-threshold',
    EncounterThreshold = 'encounter-threshold',
    EncounterAggregatedThreshold = 'encounter-aggregated-threshold',
}

const DiffiaExtensions = ({linkId, itemValidationErrors}: ExtensionProps): JSX.Element => {
    const {t} = useTranslation();
    const {state, dispatch} = useContext(TreeContext);

    const extensions = state.qItems[linkId].extension
        ?.filter((extension) => extension.url.startsWith('https://api.diffia.com/fhir/StructureDefinition/'))
        .map((extension) => {
            // Add id (for internal usage) if not already set
            return { ...extension, id: extension.id || createUUID() };
        });

    const selectOptions: ValueSetComposeIncludeConcept[] = [
        {
            code: `${DIFFIA_EXTENSION_URL_PREFIX}${DiffiaCustomExtension.ExternalThreshold}`,
            display: 'External Threshold',
        },
        {
            code: `${DIFFIA_EXTENSION_URL_PREFIX}${DiffiaCustomExtension.EncounterThreshold}`,
            display: 'Encounter Threshold',
        },
        {
            code: `${DIFFIA_EXTENSION_URL_PREFIX}${DiffiaCustomExtension.ExternalAggregatedThreshold}`,
            display: 'External Aggregated Threshold',
        },
        {
            code: `${DIFFIA_EXTENSION_URL_PREFIX}${DiffiaCustomExtension.EncounterAggregatedThreshold}`,
            display: 'Encounter Aggregated Threshold',
        },
    ];
    const createEmptyCustomExtension = (): Extension => {
        return { url: selectOptions[0].code, valueString: '' };
    };

    const updateExtension = (index: number, prop: ICustomExtensionProperty, value: string) => {
        dispatch(updateItemCustomExtensionPropertyAction(linkId, index, prop, value));
    };

    const renderExtension = (extension: Extension, index: number) => {
        const hasValidationError = itemValidationErrors.some(
            (x) => x.errorProperty.substr(0, 4) === 'code' && index === x.index,
        );
        return (
            <div key={`${extension.id}`} className={`code-section ${hasValidationError ? 'validation-error' : ''}`}>
                <div className="horizontal equal">
                    <FormField label={'Extension Type'}>
                        <Select
                            value={extension.url}
                            options={selectOptions}
                            onChange={(event) =>
                                updateExtension(index, ICustomExtensionProperty.url, event.target.value)
                            }
                        />
                    </FormField>
                    <FormField label={t('Value')}>
                        <InputField
                            defaultValue={extension.valueString}
                            onBlur={(event) =>
                                updateExtension(index, ICustomExtensionProperty.valueString, event.target.value)
                            }
                        />
                    </FormField>
                </div>
                <div className="center-text">
                    <Btn
                        title={`- Remove Extension`}
                        type="button"
                        onClick={() => dispatch(deleteItemCustomExtensionAction(linkId, index))}
                        variant="secondary"
                    />
                </div>
                <hr style={{margin: '24px 0px'}}/>
            </div>
        );
    };

    return (
        <div className="codes">
            {extensions && extensions.map((extension, index) => renderExtension(extension, index))}
            <div className="center-text">
                <Btn
                    title={`+ Add Extension`}
                    type="button"
                    onClick={() => {
                        dispatch(addItemCustomExtensionAction(linkId, createEmptyCustomExtension()));
                    }}
                    variant="primary"
                />
            </div>
        </div>
    );
};

export default DiffiaExtensions;
