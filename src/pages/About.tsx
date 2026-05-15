import { Users, Award, PenTool as Tool } from "lucide-react";
import { usePageContent } from "../hooks/useContent";
import { stripHtml } from "../lib/stripHtml";
import { EditableArea, contentEditPath } from "../components/EditableArea";
import { SEO } from "../components/SEO";

const About = () => {
  const { content } = usePageContent("about");

  // Get content from database with fallbacks (strip HTML tags)
  const pageTitle = stripHtml(content.page_title || "About LivelyLightingCo");
  const pageSubtitle = stripHtml(content.page_subtitle || "Austin's Premier Govee Permanent Lighting Installers");
  const missionTitle = stripHtml(content.mission_title || "Our Mission");
  const missionText = stripHtml(content.mission_text || "To provide homeowners with beautiful, professional permanent lighting installations that enhance their homes year-round.");
  const serviceAreaTitle = stripHtml(content.service_area_title || "Service Area");
  const serviceAreaIntro = stripHtml(content.service_area_intro || "Founded in Cedar Park, our core service area is the greater Austin metro. We are actively expanding across Texas and Oklahoma — ask about your area.");
  const serviceAreasList = stripHtml(content.service_areas_list || "Cedar Park, Round Rock, Leander, Liberty Hill, Georgetown, Lakeway, Bee Cave, West Lake Hills, Pflugerville, North Austin");

  // Parse the comma-separated list into an array
  const serviceAreas = serviceAreasList.split(",").map(city => city.trim()).filter(Boolean);

  return (
    <main className="pt-20 bg-white">
      <SEO
        canonical="/about"
        title="About — Cedar Park, TX"
        description="Founded in Cedar Park, Texas. We design and install PermTrack permanent outdoor LED lighting for homes across the Austin metro. Lifetime PermTrack hardware warranty plus 5-year workmanship warranty."
      />
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <EditableArea editPath={contentEditPath("about", "page_title")} label="Page Title">
            <h1 className="font-heading text-4xl font-bold text-surface-900 mb-4">
              {pageTitle}
            </h1>
          </EditableArea>
          <EditableArea editPath={contentEditPath("about", "page_subtitle")} label="Page Subtitle">
            <p className="text-xl text-surface-500 max-w-3xl mx-auto">
              {pageSubtitle}
            </p>
          </EditableArea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-20">
          <div className="text-center group">
            <div className="w-16 h-16 bg-brand-50 rounded-lg flex items-center justify-center mx-auto mb-4 border border-brand-100 transition-shadow group-hover:shadow-glow-sm group-hover:border-brand-200">
              <Users className="h-8 w-8 text-brand-400" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2 text-surface-900">Expert Team</h3>
            <p className="text-surface-500">
              Led by Jakob Rowe, our team brings years of lighting installation
              expertise.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-brand-50 rounded-lg flex items-center justify-center mx-auto mb-4 border border-brand-100 transition-shadow group-hover:shadow-glow-sm group-hover:border-brand-200">
              <Award className="h-8 w-8 text-brand-400" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2 text-surface-900">Quality Service</h3>
            <p className="text-surface-500">
              Lifetime PermTrack hardware warranty plus a 5-year workmanship
              warranty for true peace of mind.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-brand-50 rounded-lg flex items-center justify-center mx-auto mb-4 border border-brand-100 transition-shadow group-hover:shadow-glow-sm group-hover:border-brand-200">
              <Tool className="h-8 w-8 text-brand-400" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2 text-surface-900">
              Professional Installation
            </h3>
            <p className="text-surface-500">
              Using premium mounting systems for a clean, professional look that
              lasts.
            </p>
          </div>
        </div>

        <div className="bg-surface-900 text-white rounded-2xl p-6 sm:p-12 mb-20">
          <EditableArea editPath={contentEditPath("about", "mission_title")} label="Mission Title">
            <h2 className="font-heading text-3xl font-bold mb-6 text-center">
              {missionTitle}
            </h2>
          </EditableArea>
          <EditableArea editPath={contentEditPath("about", "mission_text")} label="Mission Text">
            <p className="text-xl text-surface-300 max-w-3xl mx-auto text-center">
              {missionText}
            </p>
          </EditableArea>
        </div>

        <div className="max-w-4xl mx-auto">
          <EditableArea editPath={contentEditPath("about", "service_area_title")} label="Service Area Title">
            <h2 className="font-heading text-3xl font-bold text-surface-900 mb-6">
              {serviceAreaTitle}
            </h2>
          </EditableArea>
          <EditableArea editPath={contentEditPath("about", "service_area_intro")} label="Service Area Introduction">
            <p className="text-lg text-surface-500 mb-6">
              {serviceAreaIntro}
            </p>
          </EditableArea>
          <EditableArea editPath={contentEditPath("about", "service_areas_list")} label="Service Areas List">
            <div className="flex flex-wrap gap-3">
              {serviceAreas.map((city, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-surface-100 border border-surface-200 rounded-lg text-surface-700 text-sm font-medium"
                >
                  {city}
                </span>
              ))}
            </div>
          </EditableArea>
        </div>
      </div>
    </main>
  );
};

export default About;
