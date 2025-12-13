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
  const serviceAreaIntro = stripHtml(content.service_area_intro || "We proudly serve Austin, Cedar Park, Round Rock, Houston and surrounding areas in Central Texas.");
  const serviceAreasList = stripHtml(content.service_areas_list || "Austin, Round Rock, Cedar Park, Georgetown, Pflugerville, Leander, Buda, Kyle, Lakeway");

  // Parse the comma-separated list into an array
  const serviceAreas = serviceAreasList.split(",").map(city => city.trim()).filter(Boolean);

  return (
    <main className="pt-20">
      <SEO
        canonical="/about"
        title="About Us - Austin's Premier Govee Lighting Installers"
        description="Meet LivelyLightingCo - Austin's expert Govee permanent outdoor lighting installers. Led by Jakob Rowe, we serve Cedar Park, Round Rock, Georgetown, Houston & Central Texas. 3-year warranty."
      />
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <EditableArea editPath={contentEditPath("about", "page_title")} label="Page Title">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {pageTitle}
            </h1>
          </EditableArea>
          <EditableArea editPath={contentEditPath("about", "page_subtitle")} label="Page Subtitle">
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {pageSubtitle}
            </p>
          </EditableArea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
            <p className="text-gray-600">
              Led by Jakob Rowe, our team brings years of lighting installation
              expertise.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Service</h3>
            <p className="text-gray-600">
              3-year warranty on all installations, ensuring lasting quality and
              peace of mind.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tool className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Professional Installation
            </h3>
            <p className="text-gray-600">
              Using premium mounting systems for a clean, professional look that
              lasts.
            </p>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-2xl p-12 mb-20">
          <EditableArea editPath={contentEditPath("about", "mission_title")} label="Mission Title">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              {missionTitle}
            </h2>
          </EditableArea>
          <EditableArea editPath={contentEditPath("about", "mission_text")} label="Mission Text">
            <p className="text-xl text-gray-700 max-w-3xl mx-auto text-center">
              {missionText}
            </p>
          </EditableArea>
        </div>

        <div className="max-w-4xl mx-auto">
          <EditableArea editPath={contentEditPath("about", "service_area_title")} label="Service Area Title">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {serviceAreaTitle}
            </h2>
          </EditableArea>
          <EditableArea editPath={contentEditPath("about", "service_area_intro")} label="Service Area Introduction">
            <p className="text-lg text-gray-600 mb-4">
              {serviceAreaIntro}
            </p>
          </EditableArea>
          <EditableArea editPath={contentEditPath("about", "service_areas_list")} label="Service Areas List">
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
              {serviceAreas.map((city, index) => (
                <li key={index}>• {city}</li>
              ))}
            </ul>
          </EditableArea>
        </div>
      </div>
    </main>
  );
};

export default About;
