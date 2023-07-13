/**
 * Copyright 2022 Wageningen Environmental Research, Wageningen UR
 * Licensed under the EUPL, Version 1.2 or as soon they
 * will be approved by the European Commission - subsequent
 * versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the
 * Licence.
 * You may obtain a copy of the Licence at:
 *
 * https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in
 * writing, software distributed under the Licence is
 * distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the Licence for the specific language governing
 * permissions and limitations under the Licence.
 */

/**
* @author https://chat.openai.com/
*/

package nl.wur.daghub;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class Main {

    public static void main(String[] args) {
        String folderPath = "folder";
        String contentFilePath = "file.txt";

        addFileContentToFiles(folderPath, contentFilePath, ".java");
    }

    private static void addFileContentToFiles(String folderPath, String contentFilePath, String extension) {
        try {
            String content = new String(Files.readAllBytes(Paths.get(contentFilePath)));
            Files.walk(Paths.get(folderPath))
                    .filter(Files::isRegularFile)
                    .filter(file -> file.toString().endsWith(extension))
                    .forEach(file -> prependContentToFile(file, content));
            System.out.println("Content added to Java files successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void prependContentToFile(Path file, String content) {
        try {
            System.out.println(file.toAbsolutePath());
            List<String> lines = Files.readAllLines(file);
            lines.add(0, content);
            Files.write(file, lines);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
