import { IQuestionnaireStatus } from '../types/IQuestionnaireMetadataType';

export const metadataOperators = [
    {
        code: IQuestionnaireStatus.active,
        display: 'Aktiv',
    },
    {
        code: IQuestionnaireStatus.draft,
        display: 'Skisse',
    },
    {
        code: IQuestionnaireStatus.retired,
        display: 'Avsluttet',
    },
    {
        code: IQuestionnaireStatus.unknown,
        display: 'Ukjent',
    },
];

export const metadataLanguage = [
    { code: 'nb-no', display: 'Norsk Bokmål ' },
    { code: 'nn-no', display: 'Nynorsk' },
    { code: 'se-no', display: 'Samisk' },
    { code: 'en-gb', display: 'Engelsk' },
];