import FlagshipEventDetail from './FlagshipEventDetail'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export default async function FlagshipEventPage({ params }: Props) {
  const { slug } = await params
  return <FlagshipEventDetail slug={slug} />
}
