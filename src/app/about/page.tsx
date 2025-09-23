import DashboardFooter from "@/components/views/dashboard/footer";
import HomepageHeader from "@/components/views/homepage/header";
import TeamItem from "@/components/views/homepage/team-item";
import ValueItem from "@/components/views/homepage/value-item";

export default function AboutPage() {
  return (
    <div className="bg-slate-100 min-h-screen py-5 lg:p-10">
      <div className="container flex flex-col px-5">
        <HomepageHeader className="text-indigo-700 mb-5 lg:mb-10" />
        <div className="p-10 bg-white rounded-3xl space-y-10 mb-5">
          <section>
            <span className="text-sm text-indigo-600 font-medium">About Us</span>
            <h2 className="text-2xl font-semibold mt-2 mb-3">The team behind your next favorite payment solution.</h2>
            <p className="text-slate-600 leading-relaxed text-balance">
              We’re a small, focused team dedicated to making crypto payments simple for vendors and seamless for
              customers. Our mission is to remove complexity from the payment process so businesses can focus on what
              they do best; serving their customers.
            </p>
          </section>
          <section className="flex items-center flex-wrap gap-10">
            <TeamItem
              name="Ali Mousavi"
              role="Frontend Developer & UI Designer"
              imageUrl="/team/ali.jpeg"
              githubUrl="https://github.com/almoloo"
            />
            <TeamItem
              name="Hossein Arabi"
              role="Backend & Smart Contract Developer"
              imageUrl="/team/hossein.jpeg"
              githubUrl="https://github.com/hossein-79"
            />
          </section>
          <section className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Simplifying Crypto Payments for Everyone</h3>
              <p className="text-slate-600 leading-relaxed text-balance">
                We believe crypto payments should be as easy as sending a text message. By combining smart blockchain
                technology with thoughtful design, we make transactions quick, secure, and stress-free; no matter your
                technical background.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Our Values</h3>
              <ValueItem title="Simplicity First" description="We cut through the complexity so you don’t have to." />
              <ValueItem
                title="Vendor Empowerment"
                description="Tools designed to give businesses control over their payments."
              />
              <ValueItem title="Transparency" description="No hidden fees, no surprises, open-sourced." />
              <ValueItem
                title="Innovation"
                description="Always exploring new ways to improve the payment experience."
              />
            </div>
          </section>
        </div>
        <DashboardFooter homepage />
      </div>
    </div>
  );
}
