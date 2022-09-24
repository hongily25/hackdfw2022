/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GetStaticProps } from 'next';

import Page from '@components/page';
import Schedule from '@components/schedule';
import Layout from '@components/layout';
import Header from '@components/header';

import { getAllStages } from '@lib/cms-api';
import { Stage } from '@lib/types';
import { META_DESCRIPTION } from '@lib/constants';
import { ClientSecretCredential } from '@azure/identity';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { Client } from '@microsoft/microsoft-graph-client';
import { UserMediaError, useUserMedia } from '@vardius/react-user-media';
import React from 'react';

type Props = {
  allStages: Stage[];
};

const { stream, error } = useUserMedia({ audio: true, video: true });

export default function SchedulePage({ allStages }: Props) {
  const meta = {
    title: 'Schedule - Virtual Event Starter Kit',
    description: 'Some text goes here'
  };
  const { stream, error } = useUserMedia({ audio: true, video: true });

  if (error) {
    return (
      <UserMediaError error={error} />
    );
  }

  // return (
  //   <video autoPlay ref={video => { video.srcObject = stream }} />
  // );

  return (
    <Page meta={meta}>
      <Layout>
        <Header hero="Schedule" description={meta.description} />
        {/* <Schedule allStages={allStages} /> */}
        <video autoPlay ref={video => { video.srcObject = stream }} />
      </Layout>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allStages: Stage[] = [];
  const scopes = 'OnlineMeetings.ReadWrite.All';
  const tenantId = '65cc8599-055a-4d70-a739-1417596f235c';
  const clientId = '5caecbe0-b118-4df9-a7ee-d12f5a493a29';
  const clientSecret = 'JZG8Q~ZhIrfG-nCsT8ar.se4yisI0QKz_pEkLapv';

  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: [scopes]
  });

  const client = Client.initWithMiddleware({
      debugLogging: true,
      authProvider
      // Use the authProvider object to create the class.
  });

  if (typeof window !== "undefined") {
    let navigator: any;

    navigator = window.navigator;


  }




  const user = await client.api('/me').get();
  console.log({user});

  return {
    props: {
      allStages
    },
    revalidate: 60
  };
};
