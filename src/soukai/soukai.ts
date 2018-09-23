import Soukai, { definitionsFromContext } from 'soukai';

import GraphQLEngine from '@/soukai/GraphQLEngine';

Soukai.useEngine(new GraphQLEngine);
Soukai.loadModels(definitionsFromContext(require.context('@/soukai/models')));
