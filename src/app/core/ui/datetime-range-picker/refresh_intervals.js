/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

export const REFRESH_INTERVALS = [
  [
    { value: 0, section: 0 }
  ],
  [
    { value: 5000, section: 1 },
    { value: 10000, section: 1 },
    { value: 30000, section: 1 },
    { value: 45000, section: 1 }
  ],
  [
    { value: 60000, section: 2 },
    { value: 300000, section: 2 },
    { value: 900000, section: 2 },
    { value: 1800000, section: 2 }
  ],
  [
    { value: 3600000, section: 3 },
    { value: 7200000, section: 3 },
    { value: 43200000, section: 3 },
    { value: 86400000, section: 3 }
  ]
];
