import { Card, CardContent } from '@documenso/ui/primitives/card';

// export const metadata: Metadata = {
//   title: 'Open Startup',
// };

// export const revalidate = 3600;

// export const dynamic = 'force-dynamic';

// const GITHUB_HEADERS: Record<string, string> = {
//   accept: 'application/vnd.github.v3+json',
// };

// if (process.env.NEXT_PRIVATE_GITHUB_TOKEN) {
//   GITHUB_HEADERS.authorization = `Bearer ${process.env.NEXT_PRIVATE_GITHUB_TOKEN}`;
// }

// const ZGithubStatsResponse = z.object({
//   stargazers_count: z.number(),
//   forks_count: z.number(),
//   open_issues: z.number(),
// });

// const ZMergedPullRequestsResponse = z.object({
//   total_count: z.number(),
// });

// const ZOpenIssuesResponse = z.object({
//   total_count: z.number(),
// });

// const ZStargazersLiveResponse = z.record(
//   z.object({
//     stars: z.number(),
//     forks: z.number(),
//     mergedPRs: z.number(),
//     openIssues: z.number(),
//   }),
// );

// const ZEarlyAdoptersResponse = z.record(
//   z.object({
//     id: z.number(),
//     time: z.string().datetime(),
//     earlyAdopters: z.number(),
//   }),
// );

// export type StargazersType = z.infer<typeof ZStargazersLiveResponse>;
// export type EarlyAdoptersType = z.infer<typeof ZEarlyAdoptersResponse>;

// const fetchGithubStats = async () => {
//   return await fetch('https://api.github.com/repos/documenso/documenso', {
//     headers: {
//       ...GITHUB_HEADERS,
//     },
//   })
//     .then(async (res) => res.json())
//     .then((res) => ZGithubStatsResponse.parse(res));
// };

// const fetchOpenIssues = async () => {
//   return await fetch(
//     'https://api.github.com/search/issues?q=repo:documenso/documenso+type:issue+state:open&page=0&per_page=1',
//     {
//       headers: {
//         ...GITHUB_HEADERS,
//       },
//     },
//   )
//     .then(async (res) => res.json())
//     .then((res) => ZOpenIssuesResponse.parse(res));
// };

// const fetchMergedPullRequests = async () => {
//   return await fetch(
//     'https://api.github.com/search/issues?q=repo:documenso/documenso/+is:pr+merged:>=2010-01-01&page=0&per_page=1',
//     {
//       headers: {
//         ...GITHUB_HEADERS,
//       },
//     },
//   )
//     .then(async (res) => res.json())
//     .then((res) => ZMergedPullRequestsResponse.parse(res));
// };

// const fetchStargazers = async () => {
//   return await fetch('https://stargrazer-live.onrender.com/api/stats', {
//     headers: {
//       accept: 'application/json',
//     },
//   })
//     .then(async (res) => res.json())
//     .then((res) => ZStargazersLiveResponse.parse(res));
// };

// const fetchEarlyAdopters = async () => {
//   return await fetch('https://stargrazer-live.onrender.com/api/stats/stripe', {
//     headers: {
//       accept: 'application/json',
//     },
//   })
//     .then(async (res) => res.json())
//     .then((res) => ZEarlyAdoptersResponse.parse(res));
// };

export default function OpenPage() {
  // const [
  //   { forks_count: forksCount, stargazers_count: stargazersCount },
  //   { total_count: openIssues },
  //   { total_count: mergedPullRequests },
  //   STARGAZERS_DATA,
  //   EARLY_ADOPTERS_DATA,
  //   MONTHLY_USERS,
  //   MONTHLY_COMPLETED_DOCUMENTS,
  // ] = await Promise.all([
  //   fetchGithubStats(),
  //   fetchOpenIssues(),
  //   fetchMergedPullRequests(),
  //   fetchStargazers(),
  //   fetchEarlyAdopters(),
  //   getUserMonthlyGrowth(),
  //   getCompletedDocumentsMonthly(),
  // ]);

  return (
    <div>
      <div className="mx-auto mt-6 max-w-screen-lg sm:mt-12">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-3xl font-bold leading-10 lg:text-5xl">
            გაამარტივეთ თქვენი სამუშაო პროცესი ჩვენთან ერთად
          </h1>

          <p className="text-muted-foreground mt-6 max-w-[60ch] text-center text-lg leading-normal">
            დაწყებული გაყიდვების კონტრაქტებიდან, ანგარიშების გახსნასა და ინვოისებამდე, არსებობს
            უამრავი დოკუმენტი, რომელზეც ხელმოწერა და შენახვა საჭიროებს{' '}
            {/* <a
              className="font-bold"
              href="https://documenso.com/blog/pre-seed"
              target="_blank"
              rel="noreferrer"
            >
              Announcing Open Metrics
            </a> */}
          </p>
        </div>

        {/* <div className="my-12 grid grid-cols-12 gap-8">
          <div className="col-span-12 grid grid-cols-4 gap-4">
            <MetricCard
              className="col-span-2 lg:col-span-1"
              title="Stargazers"
              value={stargazersCount.toLocaleString('en-US')}
            />
            <MetricCard
              className="col-span-2 lg:col-span-1"
              title="Forks"
              value={forksCount.toLocaleString('en-US')}
            />
            <MetricCard
              className="col-span-2 lg:col-span-1"
              title="Open Issues"
              value={openIssues.toLocaleString('en-US')}
            />
            <MetricCard
              className="col-span-2 lg:col-span-1"
              title="Merged PR's"
              value={mergedPullRequests.toLocaleString('en-US')}
            />
          </div>

          <TeamMembers className="col-span-12" />

          <SalaryBands className="col-span-12" />
        </div>

        <h2 className="px-4 text-2xl font-semibold">Finances</h2>
        <div className="mb-12 mt-4 grid grid-cols-12 gap-8">
          <FundingRaised data={FUNDING_RAISED} className="col-span-12 lg:col-span-6" />

          <CapTable className="col-span-12 lg:col-span-6" />
        </div>

        <h2 className="px-4 text-2xl font-semibold">Community</h2>
        <div className="mb-12 mt-4 grid grid-cols-12 gap-8">
          <BarMetric<StargazersType>
            data={STARGAZERS_DATA}
            metricKey="stars"
            title="GitHub: Total Stars"
            label="Stars"
            className="col-span-12 lg:col-span-6"
          />

          <BarMetric<StargazersType>
            data={STARGAZERS_DATA}
            metricKey="mergedPRs"
            title="GitHub: Total Merged PRs"
            label="Merged PRs"
            chartHeight={400}
            className="col-span-12 lg:col-span-6"
          />

          <BarMetric<StargazersType>
            data={STARGAZERS_DATA}
            metricKey="forks"
            title="GitHub: Total Forks"
            label="Forks"
            chartHeight={400}
            className="col-span-12 lg:col-span-6"
          />

          <BarMetric<StargazersType>
            data={STARGAZERS_DATA}
            metricKey="openIssues"
            title="GitHub: Total Open Issues"
            label="Open Issues"
            chartHeight={400}
            className="col-span-12 lg:col-span-6"
          />

          <Typefully className="col-span-12 lg:col-span-6" />
        </div>

        <h2 className="px-4 text-2xl font-semibold">Growth</h2>
        <div className="mb-12 mt-4 grid grid-cols-12 gap-8">
          <BarMetric<EarlyAdoptersType>
            data={EARLY_ADOPTERS_DATA}
            metricKey="earlyAdopters"
            title="Early Adopters"
            label="Early Adopters"
            className="col-span-12 lg:col-span-6"
            extraInfo={<OpenPageTooltip />}
          />

          <MonthlyTotalUsersChart data={MONTHLY_USERS} className="col-span-12 lg:col-span-6" />
          <MonthlyNewUsersChart data={MONTHLY_USERS} className="col-span-12 lg:col-span-6" />

          <MonthlyCompletedDocumentsChart
            data={MONTHLY_COMPLETED_DOCUMENTS}
            className="col-span-12 lg:col-span-6"
          />
          <TotalSignedDocumentsChart
            data={MONTHLY_COMPLETED_DOCUMENTS}
            className="col-span-12 lg:col-span-6"
          />
        </div> */}
      </div>

      {/* ვარიანტი 1 */}
      {/* <div className="col-span-12 mt-16 flex flex-col items-center justify-center">
        <h2 className="text-center text-2xl font-bold">
          მნიშვნელობა არ აქვს სად იმყოფებით ციფრულ ტრანსფორმაციაში, <br /> Ipografi დაგეხმარებათ
        </h2>
        <div className="flex gap-x-7">
          <Card spotlight className="mt-12">
            <CardContent className="flex flex-col justify-center p-12">
              <h2 className="text-left text-2xl font-bold">დამწყები</h2>

              <p className="text-muted-foreground mt-4 max-w-[55ch]  leading-normal">
                გაზარდეთ ეფექტურობა და უსაფრთხოება ქაღალდის დოკუმენტებიდან ციფრულ შეთანხმებებზე
                გადასვლით
              </p>
            </CardContent>
          </Card>

          <Card spotlight className="mt-12">
            <CardContent className="flex flex-col justify-center p-12">
              <h2 className="text-2xl font-bold">მზარდი</h2>

              <p className="text-muted-foreground mt-4 max-w-[55ch] leading-normal">
                გახადეთ გუნდი მეტად პროდუქტიული და გაამარტივეთ ყოველდღიური, მოსაწყენი ოპერაციები
              </p>
            </CardContent>
          </Card>

          <Card spotlight className="mt-12">
            <CardContent className="flex flex-col justify-center p-12">
              <h2 className="text-left text-2xl font-bold">მასშტაბირებადი</h2>

              <p className="text-muted-foreground mt-4 max-w-[55ch] leading-normal">
                გაამარტივეთ და გააუმჯობესეთ თქვენი სამუშაო პროცესი ყველა განყოფილების, პროცესისა თუ
                თანამშრომლების მძლავრი ფუნქციებით დაკავშირებით
              </p>
            </CardContent>
          </Card>
        </div>
      </div> */}

      {/* ვარიანტი 2 */}
      <div className="col-span-12 mt-28 flex flex-col items-center justify-center">
        <h2 className="text-center text-2xl font-bold">
          ციფრული დოკუმენტები ყველა დეპარტამენტისთვის
        </h2>

        {/* <p className="text-muted-foreground mt-4 max-w-[55ch] text-center text-lg leading-normal">
          This page is evolving as we learn what makes a great signing company. We'll update it when
          we have more to share.
        </p> */}
        <div className="grid grid-cols-3 gap-x-7">
          <Card spotlight className="mt-12">
            <CardContent className="flex flex-col justify-center p-12">
              <h2 className="text-left text-2xl font-bold">HR</h2>

              <p className="text-muted-foreground mt-4 max-w-[55ch]  leading-normal">
                გაზარდეთ ეფექტურობა ქაღალდიდან ციფრულ დოკუმენტებზე გადასვლით.
              </p>
            </CardContent>
          </Card>

          <Card spotlight className="mt-12">
            <CardContent className="flex flex-col justify-center p-12">
              <h2 className="text-2xl font-bold">გაყიდვები</h2>

              <p className="text-muted-foreground mt-4 max-w-[55ch] leading-normal">
                დახურეთ გარიგებები უფრო სწრაფად და ეფექტურად თქვენი ელექტრონული ხელმოწერით.
              </p>
            </CardContent>
          </Card>

          <Card spotlight className="mt-12">
            <CardContent className="flex flex-col justify-center p-12">
              <h2 className="text-2xl font-bold">შესყიდვები</h2>

              <p className="text-muted-foreground mt-4 max-w-[55ch] leading-normal">
                დაზოგეთ დრო, გააკონტროლეთ ხარჯები და შეამცირეთ რისკები მიწოდების ჯაჭვში.
              </p>
            </CardContent>
          </Card>

          <Card spotlight className="mt-12">
            <CardContent className="flex flex-col justify-center p-12">
              <h2 className="text-left text-2xl font-bold">იურიდიული</h2>

              <p className="text-muted-foreground mt-4 max-w-[55ch] leading-normal">
                შეამცირეთ რისკი და მოახდინეთ ხელშეკრულების ენის სტანდარტიზაცია.
              </p>
            </CardContent>
          </Card>

          <Card spotlight className="mt-12">
            <CardContent className="flex flex-col justify-center p-12">
              <h2 className="text-left text-2xl font-bold">IT</h2>

              <p className="text-muted-foreground mt-4 max-w-[55ch] leading-normal">
                დაზოგეთ დრო იმ პროცესების ავტომატიზირებით, რომლებიც საჭიროებენ ხელმოწერას.
              </p>
            </CardContent>
          </Card>

          <Card spotlight className="mt-12">
            <CardContent className="flex flex-col justify-center p-12">
              <h2 className="text-left text-2xl font-bold">ფინანსები</h2>

              <p className="text-muted-foreground mt-4 max-w-[55ch] leading-normal">
                დააჩქარეთ ინვოისები და მარტივად დაამენეჯმენტეთ თქვენი კრიტიკული დოკუმენტები.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <CallToAction className="mt-12" utmSource="open-page" /> */}




      {/* გამოყენებები */}
      <Card spotlight className="mt-28">
        <CardContent className="flex flex-col items-center justify-center p-12 ">
          <h2 className="text-center text-2xl font-bold">
            ელექტრონული ხელმოწერები ყველა ინდუსტრიისთვის
          </h2>

          <div className="grid grid-cols-2 gap-x-10">
            <Card spotlight className="mt-12 ">
              <CardContent className="flex flex-col justify-center p-8">
                <img
                  className="mb-10 rounded rounded-bl-3xl"
                  src="https://i.postimg.cc/VvNXTWVW/insurance.jpg"
                  alt="insurance"
                />

                <h2 className="text-left text-2xl font-bold">სადაზღვეო</h2>

                <p className="text-muted-foreground mt-4 max-w-[55ch] leading-normal">
                  დააჩქარეთ პოლისის მიწოდებები და მოთხოვნების მოგვარება. გაუმარტივეთ საქმე
                  დაზღვეულებსა და თანამშრომლებს.
                </p>

                {/* <ul className="mt-8">
                  <li className="list-disc text-sm text-slate-600 "> პოლისის მყისიერი განახლება</li>
                  <li className="list-disc text-sm text-slate-600 ">
                    საჩივრის დაჩქარებული დამუშავება
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დოკუმენტების უსაფრთხოდ შენახვა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    შემცირებული საოპერაციო ხარჯები
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    Enhanced customer satisfaction
                  </li>
                </ul> */}
              </CardContent>
            </Card>

            <Card spotlight className="mt-12 ">
              <CardContent className="flex flex-col justify-center p-8">
                <img
                  className="mb-10 rounded rounded-bl-3xl"
                  src="https://i.postimg.cc/T3jhVWkd/finance.jpg"
                  alt="insurance"
                />

                <h2 className="text-left text-2xl font-bold">ფინანსები</h2>

                <p className="text-muted-foreground mt-4 max-w-[55ch] leading-normal">
                  დააჩქარეთ პოლისის მიწოდებები და მოთხოვნების მოგვარება. გაუმარტივეთ საქმე
                  დაზღვეულებსა და თანამშრომლებს.
                </p>

                {/* <ul className="mt-8">
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დაჩქარებული სესხის და ანგარიშის გახსნა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დოკუმენტების უსაფრთხოდ გაცვლა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დოკუმენტების უსაფრთხოდ შენახვა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    შემცირებული საოპერაციო ხარჯები
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    შემცირებული დამუშავების დრო
                  </li>
                </ul> */}
              </CardContent>
            </Card>

            <Card spotlight className="mt-12 ">
              <CardContent className="flex flex-col justify-center p-8">
                <img
                  className="mb-10 rounded rounded-bl-3xl"
                  src="https://i.postimg.cc/RZHdm9M6/government.jpg"
                  alt="insurance"
                />

                <h2 className="text-left text-2xl font-bold">საჯარო</h2>

                <p className="text-muted-foreground mt-4 max-w-[55ch] leading-normal">
                  აამაღლეთ საჯარო სერვისების ხარისხი, მათი ხელმისავდომობის გამარტივებითა და
                  პროცესების დაჩქარებით.
                </p>

                {/* <ul className="mt-8">
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დაჩქარებული სესხის და ანგარიშის გახსნა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დოკუმენტების უსაფრთხოდ გაცვლა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დოკუმენტების უსაფრთხოდ შენახვა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    შემცირებული საოპერაციო ხარჯები
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    შემცირებული დამუშავების დრო
                  </li>
                </ul> */}
              </CardContent>
            </Card>

            <Card spotlight className="mt-12 ">
              <CardContent className="flex flex-col justify-center p-8">
                <img
                  className="mb-10 rounded rounded-bl-3xl"
                  src="https://i.postimg.cc/6p2jQnhQ/healthcare.jpg"
                  alt="insurance"
                />

                <h2 className="text-left text-2xl font-bold">ჯანდაცვა</h2>

                <p className="text-muted-foreground mt-4 max-w-[55ch] leading-normal">
                  გაამარტივეთ დოკუმენტების ხელმოწერა და გაგზავნა და გაზარდეთ პაციენტის ნდობა და
                  კმაყოფილება.
                </p>

                {/* <ul className="mt-8">
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დაჩქარებული სესხის და ანგარიშის გახსნა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დოკუმენტების უსაფრთხოდ გაცვლა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დოკუმენტების უსაფრთხოდ შენახვა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    შემცირებული საოპერაციო ხარჯები
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    შემცირებული დამუშავების დრო
                  </li>
                </ul> */}
              </CardContent>
            </Card>

            <Card spotlight className="mt-12 ">
              <CardContent className="flex flex-col justify-center p-8">
                <img
                  className="mb-10 rounded rounded-bl-3xl"
                  src="https://i.postimg.cc/GmL3w3Pz/science.jpg"
                  alt="insurance"
                />

                <h2 className="text-left text-2xl font-bold">მეცნიერება</h2>

                <p className="text-muted-foreground mt-4 max-w-[55ch] leading-normal">
                  შეთანხმების პროცესების გაციფრულებით, დააჩქარეთ ახალი მედიკამენტებისა და მოწყობილობების წარმოებაში გამოშვება.
                </p>

                {/* <ul className="mt-8">
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დაჩქარებული სესხის და ანგარიშის გახსნა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დოკუმენტების უსაფრთხოდ გაცვლა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დოკუმენტების უსაფრთხოდ შენახვა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    შემცირებული საოპერაციო ხარჯები
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    შემცირებული დამუშავების დრო
                  </li>
                </ul> */}
              </CardContent>
            </Card>

            <Card spotlight className="mt-12 ">
              <CardContent className="flex flex-col justify-center p-8">
                <img
                  className="mb-10 rounded rounded-bl-3xl"
                  src="https://i.postimg.cc/hjb3Bn1b/real-estate.jpg"
                  alt="insurance"
                />

                <h2 className="text-left text-2xl font-bold">უძრავი ქონება</h2>

                <p className="text-muted-foreground mt-4 max-w-[55ch] leading-normal">
                  მიეცით თქვენს კლიენტებს საშუალება გამოსცადონ თანამედროვე და კომფორტული გზა, დოკუმენტებზე ხელმოსაწერად
                </p>

                {/* <ul className="mt-8">
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დაჩქარებული სესხის და ანგარიშის გახსნა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დოკუმენტების უსაფრთხოდ გაცვლა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    დოკუმენტების უსაფრთხოდ შენახვა
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    შემცირებული საოპერაციო ხარჯები
                  </li>
                  <li className="list-disc text-sm text-slate-600 ">
                    {' '}
                    შემცირებული დამუშავების დრო
                  </li>
                </ul> */}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
