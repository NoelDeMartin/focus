import Soukai, { definitionsFromContext } from 'soukai';

import RDFEngine from '@/soukai/RDFEngine';

Soukai.useEngine(new RDFEngine);
Soukai.loadModels(definitionsFromContext(require.context('@/soukai/models')));
