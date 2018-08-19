// tslint:disable
import {
  Client,
  LocalKeyStore,
  LocalMemoryStore,
  LocalUserAccountProvider,
  NEOONEProvider,
  UserAccountProvider,
} from '@neo-one/client';

type DefaultUserAccountProviders = {
  readonly memory: LocalUserAccountProvider<LocalKeyStore, NEOONEProvider>;
};
const getDefaultUserAccountProviders = (provider: NEOONEProvider): DefaultUserAccountProviders => ({
  memory: new LocalUserAccountProvider({
    keystore: new LocalKeyStore({ store: new LocalMemoryStore() }),
    provider,
  }),
});

const isLocalUserAccountProvider = (
  userAccountProvider: UserAccountProvider,
): userAccountProvider is LocalUserAccountProvider<any, any> => userAccountProvider instanceof LocalUserAccountProvider;

export const createClient = <
  TUserAccountProviders extends { readonly [K: string]: UserAccountProvider } = DefaultUserAccountProviders
>(
  getUserAccountProviders: (provider: NEOONEProvider) => TUserAccountProviders = getDefaultUserAccountProviders as any,
): Client<TUserAccountProviders> => {
  const provider = new NEOONEProvider([{ network: 'local', rpcURL: 'http://localhost:48297/rpc' }]);
  const userAccountProviders = getUserAccountProviders(provider);

  const localUserAccountProviders = Object.values(userAccountProviders).filter(isLocalUserAccountProvider);
  const localUserAccountProvider = localUserAccountProviders.find(
    (userAccountProvider) => userAccountProvider.keystore instanceof LocalKeyStore,
  );
  if (localUserAccountProvider !== undefined) {
    const localKeyStore = localUserAccountProvider.keystore;
    if (localKeyStore instanceof LocalKeyStore) {
      localKeyStore
        .addAccount({
          network: 'local',
          name: 'master',
          privateKey: 'L4qhHtwbiAMu1nrSmsTP5a3dJbxA3SNS6oheKnKd8E7KTJyCLcUv',
        })
        .catch(() => {
          // do nothing
        });
    }
  }

  return new Client(userAccountProviders);
};
