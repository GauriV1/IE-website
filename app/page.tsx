import DocumentDirectorySection from '@/components/DocumentDirectorySection';
import FlowchartSection from '@/components/FlowchartSection';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-whitman-navy mb-4">
          Division of Inclusive Excellence
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-whitman-blue mb-4">Digital Handbook</h2>
        <p className="text-lg text-whitman-gray max-w-3xl">
          Your central hub for resources, policies, and services from Whitman College&apos;s Division of
          Inclusive Excellence. Find what you need quickly and easily.
        </p>
      </div>

      <div className="mb-16" id="directory">
        <DocumentDirectorySection embedded />
      </div>

      <FlowchartSection />

      <section id="about" className="scroll-mt-24 mt-16 mb-16 bg-whitman-lightblue rounded-lg p-8 border border-whitman-blue">
        <h2 className="text-2xl font-bold text-whitman-navy mb-4">About the Division of Inclusive Excellence</h2>
        <p className="text-whitman-gray leading-relaxed mb-4">
          The Division of Inclusive Excellence at Whitman College is dedicated to fostering an inclusive,
          equitable, and welcoming environment for all members of our community. This digital handbook serves
          as a comprehensive resource for policies, procedures, resources, and support services.
        </p>
        <p className="text-whitman-gray leading-relaxed">
          Use the navigation above to explore tasks, policies, teams, tools, news, and directory information.
          All content is organized to help you find what you need quickly and efficiently.
        </p>
      </section>
    </div>
  );
}
